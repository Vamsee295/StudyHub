import os
import json
import tempfile
import subprocess
import re
import sys
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.services.sandbox import run_sandboxed


class ParameterDef(BaseModel):
    name: str
    type: str


class FunctionSignature(BaseModel):
    language: str
    className: str
    methodName: str
    returnType: str
    parameters: List[ParameterDef]


class TestCase(BaseModel):
    id: str
    input: Dict[str, Any]
    expectedOutput: Any


class ExecutionRequest(BaseModel):
    code: str = Field(max_length=100_000)
    problemId: str
    functionSignature: FunctionSignature
    testCases: List[TestCase]


class TestCaseResult(BaseModel):
    id: str
    status: str
    input: Dict[str, Any]
    expectedOutput: Any
    actualOutput: Optional[Any] = None
    runtimeMs: Optional[int] = None
    error: Optional[str] = None


class CompilationErrorMarker(BaseModel):
    line: int
    column: int
    message: str
    severity: str


class ExecutionResult(BaseModel):
    status: str
    passedTests: int
    totalTests: int
    runtimeMs: Optional[int] = None
    memoryMb: Optional[float] = None
    testResults: List[TestCaseResult]
    compilerError: Optional[str] = None
    compilerMarkers: Optional[List[CompilationErrorMarker]] = None
    runtimeError: Optional[str] = None
    submissionId: Optional[str] = None  # set when a submit was saved to the learner's history


def _json_to_java_literal(val: Any, t: str) -> str:
    """Convert a Python value to its Java literal representation."""
    if t == "int":
        return str(int(val))
    elif t == "double":
        return f"{val}d"
    elif t == "boolean":
        return "true" if val else "false"
    elif t == "String":
        escaped = str(val).replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    elif t == "int[]":
        vals = ", ".join(str(int(v)) for v in val)
        return "new int[]{" + vals + "}"
    elif t == "String[]":
        parts = []
        for v in val:
            escaped = str(v).replace("\\", "\\\\").replace('"', '\\"')
            parts.append(f'"{escaped}"')
        return "new String[]{" + ", ".join(parts) + "}"
    elif t == "int[][]":
        rows = []
        for row in val:
            vals = ", ".join(str(int(v)) for v in row)
            rows.append("new int[]{" + vals + "}")
        return "new int[][]{" + ", ".join(rows) + "}"
    elif t == "ListNode":
        if val is None or len(val) == 0:
            return "null"
        vals = ", ".join(str(int(v)) for v in val)
        return "ListNode.fromArray(new int[]{" + vals + "})"
    elif t == "TreeNode":
        # level-order with nulls for missing children, as on LeetCode: [3, 9, 20, null, null, 15, 7]
        if not val or val[0] is None:
            return "null"
        vals = ", ".join("null" if v is None else str(int(v)) for v in val)
        return "TreeNode.fromArray(new Integer[]{" + vals + "})"
    else:
        # Fallback for unknown types
        return str(val)


def _parse_javac_output(output: str) -> List[CompilationErrorMarker]:
    markers = []
    pattern = re.compile(r"([a-zA-Z0-9_]+)\.java:(\d+): (error|warning): (.*)")
    for line in output.splitlines():
        m = pattern.match(line.strip())
        if m:
            _, line_num, severity, message = m.groups()
            markers.append(CompilationErrorMarker(
                line=int(line_num),
                column=1,
                message=message,
                severity=severity
            ))
    return markers


def _java_print_for_type(return_type: str, var_name: str = "res") -> str:
    """Return a Java snippet that prints the result as JSON-compatible string."""
    if return_type == "int[]":
        return f"""
            if ({var_name} == null) {{
                System.out.print("null");
            }} else {{
                System.out.print("[");
                for (int _i = 0; _i < {var_name}.length; _i++) {{
                    System.out.print({var_name}[_i]);
                    if (_i < {var_name}.length - 1) System.out.print(", ");
                }}
                System.out.print("]");
            }}"""
    elif return_type == "String[]":
        return f"""
            if ({var_name} == null) {{
                System.out.print("null");
            }} else {{
                System.out.print("[");
                for (int _i = 0; _i < {var_name}.length; _i++) {{
                    System.out.print("\\"" + {var_name}[_i].replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"");
                    if (_i < {var_name}.length - 1) System.out.print(", ");
                }}
                System.out.print("]");
            }}"""
    elif return_type == "int[][]":
        return f"""
            if ({var_name} == null) {{
                System.out.print("null");
            }} else {{
                System.out.print("[");
                for (int _r = 0; _r < {var_name}.length; _r++) {{
                    System.out.print("[");
                    for (int _c = 0; _c < {var_name}[_r].length; _c++) {{
                        System.out.print({var_name}[_r][_c]);
                        if (_c < {var_name}[_r].length - 1) System.out.print(", ");
                    }}
                    System.out.print("]");
                    if (_r < {var_name}.length - 1) System.out.print(", ");
                }}
                System.out.print("]");
            }}"""
    elif return_type == "boolean":
        return f"System.out.print({var_name});"
    elif return_type == "String":
        return f"""
            if ({var_name} == null) {{
                System.out.print("null");
            }} else {{
                System.out.print("\\"" + {var_name}.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"");
            }}"""
    elif return_type == "ListNode":
        return f"ListNode.printList({var_name});"
    elif return_type == "TreeNode":
        return f"TreeNode.printTree({var_name});"
    else:
        # int, long, double, etc.
        return f"System.out.print({var_name});"


def generate_java_test_harness(request: ExecutionRequest) -> str:
    sig = request.functionSignature
    cases_code_parts = []

    for tc in request.testCases:
        args = []
        for param in sig.parameters:
            args.append(_json_to_java_literal(tc.input[param.name], param.type))
        args_str = ", ".join(args)
        print_stmt = _java_print_for_type(sig.returnType)
        safe_id = tc.id.replace('"', '\\"')

        case_code = f"""
        try {{
            long _start = System.currentTimeMillis();
            {sig.className} sol = new {sig.className}();  // a fresh object per test, as on LeetCode
            {sig.returnType} res = sol.{sig.methodName}({args_str});
            long _end = System.currentTimeMillis();
            System.out.print("{{\\"id\\": \\"{safe_id}\\", \\"runtimeMs\\": " + (_end - _start) + ", \\"actualOutput\\": ");
            {print_stmt}
            System.out.println("}}");
        }} catch (Exception _ex) {{
            String _msg = _ex.getMessage() != null ? _ex.getMessage().replace("\\"", "\\\\\\"") : _ex.getClass().getName();
            System.out.println("{{\\"id\\": \\"{safe_id}\\", \\"error\\": \\"" + _msg + "\\"}}");
        }}"""
        cases_code_parts.append(case_code)

    all_cases = "\n".join(cases_code_parts)

    return f"""public class Main {{
    public static void main(String[] args) {{

        {all_cases}
    }}
}}
"""


def compare_output(expected: Any, actual: Any) -> bool:
    """Compare expected vs actual output recursively."""
    if isinstance(expected, bool) or isinstance(actual, bool):
        return bool(expected) == bool(actual) and type(expected) is type(actual)

    if isinstance(expected, list):
        if not isinstance(actual, list):
            return False
        if len(expected) != len(actual):
            return False
        return all(compare_output(e, a) for e, a in zip(expected, actual))

    # Numeric comparison
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return abs(float(expected) - float(actual)) < 1e-5

    # String fallback
    return str(expected).strip() == str(actual).strip()


JAVA_TREENODE = """import java.util.*;

public class TreeNode {
    public int val;
    public TreeNode left, right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }

    public static TreeNode fromArray(Integer[] a) {
        if (a == null || a.length == 0 || a[0] == null) return null;
        TreeNode root = new TreeNode(a[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < a.length) {
            TreeNode n = q.poll();
            if (i < a.length && a[i] != null) { n.left = new TreeNode(a[i]); q.add(n.left); }
            i++;
            if (i < a.length && a[i] != null) { n.right = new TreeNode(a[i]); q.add(n.right); }
            i++;
        }
        return root;
    }

    public static void printTree(TreeNode root) {
        List<String> out = new ArrayList<>();
        Deque<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) { out.add("null"); continue; }
            out.add(String.valueOf(n.val));
            q.add(n.left);
            q.add(n.right);
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
        System.out.print("[" + String.join(", ", out) + "]");
    }
}
"""


def execute_java(request: ExecutionRequest) -> ExecutionResult:
    """Compile and run Java code via the sandbox (Docker unless CODE_SANDBOX=local)."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # ── Write files ────────────────────────────────────────────────────
        listnode_path = os.path.join(tmpdir, "ListNode.java")
        with open(listnode_path, "w", encoding="utf-8") as f:
            f.write("""public class ListNode {
    public int val;
    public ListNode next;
    public ListNode() {}
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }

    public static ListNode fromArray(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        if (head == null) {
            System.out.print("[]");
            return;
        }
        System.out.print("[");
        ListNode curr = head;
        while (curr != null) {
            System.out.print(curr.val);
            if (curr.next != null) System.out.print(", ");
            curr = curr.next;
        }
        System.out.print("]");
    }
}
""")

        with open(os.path.join(tmpdir, "TreeNode.java"), "w", encoding="utf-8") as f:
            f.write(JAVA_TREENODE)

        sol_path = os.path.join(tmpdir, f"{request.functionSignature.className}.java")
        with open(sol_path, "w", encoding="utf-8") as f:
            f.write(request.code)

        main_path = os.path.join(tmpdir, "Main.java")
        harness_code = generate_java_test_harness(request)
        with open(main_path, "w", encoding="utf-8") as f:
            f.write(harness_code)

        # ── Compile ────────────────────────────────────────────────────────
        compile_cmd = [
            "javac",
            "ListNode.java",
            "TreeNode.java",
            f"{request.functionSignature.className}.java",
            "Main.java",
        ]

        try:
            compile_res = run_sandboxed(compile_cmd, tmpdir, timeout=30)
            if compile_res.returncode != 0:
                error_text = (compile_res.stderr.strip() or compile_res.stdout.strip())
                markers = _parse_javac_output(error_text)
                return ExecutionResult(
                    status="compile_error",
                    passedTests=0,
                    totalTests=len(request.testCases),
                    testResults=[],
                    compilerError=error_text,
                    compilerMarkers=markers,
                )
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                status="compile_error",
                passedTests=0,
                totalTests=len(request.testCases),
                testResults=[],
                compilerError="Compilation timed out (30s limit).",
            )

        # ── Execute ────────────────────────────────────────────────────────
        exec_cmd = [
            "java", "Main",
        ]

        try:
            exec_res = run_sandboxed(exec_cmd, tmpdir, timeout=6)
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                status="time_limit",
                passedTests=0,
                totalTests=len(request.testCases),
                testResults=[],
                runtimeError="Time Limit Exceeded (5000ms)",
            )

        # ── Parse output ───────────────────────────────────────────────────
        results_dict: Dict[str, Any] = {}
        for line in exec_res.stdout.splitlines():
            line = line.strip()
            if line.startswith("{") and line.endswith("}"):
                try:
                    parsed = json.loads(line)
                    if "id" in parsed:
                        results_dict[parsed["id"]] = parsed
                except json.JSONDecodeError:
                    pass

        # ── Build per-test results ─────────────────────────────────────────
        test_results: List[TestCaseResult] = []
        passed_count = 0
        has_runtime_error = False

        for tc in request.testCases:
            raw = results_dict.get(tc.id, {})
            error = raw.get("error")
            actual_out = raw.get("actualOutput")
            runtime = int(raw.get("runtimeMs", 0))

            if error:
                status = "runtime_error"
                has_runtime_error = True
            elif "actualOutput" in raw:
                if compare_output(tc.expectedOutput, actual_out):
                    status = "passed"
                    passed_count += 1
                else:
                    status = "wrong_answer"
            else:
                status = "runtime_error"
                error = "No output was produced for this test case."
                has_runtime_error = True

            test_results.append(TestCaseResult(
                id=tc.id,
                status=status,
                input=tc.input,
                expectedOutput=tc.expectedOutput,
                actualOutput=actual_out if "actualOutput" in raw else None,
                runtimeMs=runtime,
                error=error,
            ))

        # ── Overall verdict ────────────────────────────────────────────────
        if has_runtime_error:
            overall_status = "runtime_error"
        elif passed_count < len(request.testCases):
            overall_status = "wrong_answer"
        else:
            overall_status = "accepted"

        stderr_text = exec_res.stderr.strip() if exec_res.stderr.strip() else None

        return ExecutionResult(
            status=overall_status,
            passedTests=passed_count,
            totalTests=len(request.testCases),
            runtimeMs=sum((tr.runtimeMs or 0) for tr in test_results),
            testResults=test_results,
            runtimeError=stderr_text if has_runtime_error else None,
        )



PY_NODES = '''class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def _to_list_node(a):
    head = None
    for v in reversed(a or []):
        head = ListNode(v, head)
    return head


def _to_tree(a):
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0])
    q, i = deque([root]), 1
    while q and i < len(a):
        n = q.popleft()
        if i < len(a) and a[i] is not None:
            n.left = TreeNode(a[i]); q.append(n.left)
        i += 1
        if i < len(a) and a[i] is not None:
            n.right = TreeNode(a[i]); q.append(n.right)
        i += 1
    return root


def _plain(res, is_node=False):
    """Results as JSON: lists for ListNode, level order with nulls for TreeNode."""
    if res is None and is_node:
        return []  # an empty list or tree prints as [] in every language
    if isinstance(res, ListNode):
        out = []
        while res:
            out.append(res.val); res = res.next
        return out
    if isinstance(res, TreeNode):
        out, q = [], deque([res])
        while q:
            n = q.popleft()
            out.append(None if n is None else n.val)
            if n is not None:
                q.append(n.left); q.append(n.right)
        while out and out[-1] is None:
            out.pop()
        return out
    if isinstance(res, tuple):
        return list(res)
    return res'''


def generate_python_test_harness(request: ExecutionRequest) -> str:
    sig = request.functionSignature
    is_node = sig.returnType in ("ListNode", "TreeNode")
    cases_code_parts = []
    for tc in request.testCases:
        args = []
        for param in sig.parameters:
            literal = repr(tc.input[param.name])  # a Python literal (True/None), not JSON (true/null)
            wrap = {"ListNode": "_to_list_node", "TreeNode": "_to_tree"}.get(param.type)
            args.append(f"{wrap}({literal})" if wrap else literal)
        args_str = ", ".join(args)
        safe_id = tc.id.replace('"', '\\"')

        case_code = f"""
    try:
        _start = time.time()
        sol = {sig.className}()  # a fresh object per test, as on LeetCode
        res = sol.{sig.methodName}({args_str})
        _end = time.time()
        print(json.dumps({{"id": "{safe_id}", "runtimeMs": int((_end - _start) * 1000), "actualOutput": _plain(res, {is_node})}}))
    except Exception as e:
        print(json.dumps({{"id": "{safe_id}", "error": str(e)}}))"""
        cases_code_parts.append(case_code)

    all_cases = "\n".join(cases_code_parts)

    return f"""import json
import time
from collections import deque
from typing import *

{PY_NODES}

{request.code}

def __main():

{all_cases}

if __name__ == '__main__':
    __main()
"""


def execute_python(request: ExecutionRequest) -> ExecutionResult:
    import time
    with tempfile.TemporaryDirectory() as tmpdir:
        sol_path = os.path.join(tmpdir, "main.py")
        harness_code = generate_python_test_harness(request)
        with open(sol_path, "w", encoding="utf-8") as f:
            f.write(harness_code)

        exec_cmd = ["python", "main.py"]

        try:
            exec_res = run_sandboxed(exec_cmd, tmpdir, timeout=6)
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                status="time_limit", passedTests=0, totalTests=len(request.testCases),
                testResults=[], runtimeError="Time Limit Exceeded (5000ms)"
            )

        return parse_execution_output(exec_res, request)


def _json_to_cpp_literal(val: Any, t: str) -> str:
    if t == "int":
        return str(int(val))
    elif t == "double":
        return str(float(val))
    elif t == "boolean":
        return "true" if val else "false"
    elif t == "String":
        escaped = str(val).replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    elif t == "int[]":
        vals = ", ".join(str(int(v)) for v in val)
        return "std::vector<int>{" + vals + "}"
    elif t == "String[]":
        parts = []
        for v in val:
            escaped = str(v).replace("\\", "\\\\").replace('"', '\\"')
            parts.append(f'"{escaped}"')
        return "std::vector<std::string>{" + ", ".join(parts) + "}"
    elif t == "int[][]":
        rows = []
        for row in val:
            vals = ", ".join(str(int(v)) for v in row)
            rows.append("std::vector<int>{" + vals + "}")
        return "std::vector<std::vector<int>>{" + ", ".join(rows) + "}"
    elif t == "ListNode":
        return "_mklist({" + ", ".join(str(int(v)) for v in (val or [])) + "})"
    elif t == "TreeNode":
        return "_mktree({" + ", ".join("INT_MIN" if v is None else str(int(v)) for v in (val or [])) + "})"
    else:
        return str(val)

def _cpp_print_for_type(return_type: str, var_name: str = "res") -> str:
    if return_type == "int[]":
        return f"""
            std::cout << "[";
            for (size_t _i = 0; _i < {var_name}.size(); _i++) {{
                std::cout << {var_name}[_i];
                if (_i < {var_name}.size() - 1) std::cout << ", ";
            }}
            std::cout << "]";"""
    elif return_type == "int[][]":
        return f"""
            std::cout << "[";
            for (size_t _r = 0; _r < {var_name}.size(); _r++) {{
                std::cout << "[";
                for (size_t _c = 0; _c < {var_name}[_r].size(); _c++) {{
                    std::cout << {var_name}[_r][_c];
                    if (_c < {var_name}[_r].size() - 1) std::cout << ", ";
                }}
                std::cout << "]";
                if (_r < {var_name}.size() - 1) std::cout << ", ";
            }}
            std::cout << "]";"""
    elif return_type == "String":
        return f"std::cout << _q({var_name});"
    elif return_type == "String[]":
        return f"""
            std::cout << "[";
            for (size_t _i = 0; _i < {var_name}.size(); _i++) {{
                std::cout << _q({var_name}[_i]);
                if (_i < {var_name}.size() - 1) std::cout << ", ";
            }}
            std::cout << "]";"""
    elif return_type == "boolean":
        return f"""
            std::cout << ({var_name} ? "true" : "false");"""
    elif return_type == "ListNode":
        return f"_plist({var_name});"
    elif return_type == "TreeNode":
        return f"_ptree({var_name});"
    else:
        return f"std::cout << {var_name};"

CPP_NODES = """struct ListNode {
    int val; ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};
struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};
static ListNode* _mklist(const vector<int>& a) {
    ListNode* head = nullptr;
    for (int i = (int)a.size() - 1; i >= 0; i--) head = new ListNode(a[i], head);
    return head;
}
static TreeNode* _mktree(const vector<int>& a) {  // INT_MIN marks a missing child
    if (a.empty() || a[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(a[0]);
    queue<TreeNode*> q; q.push(root);
    size_t i = 1;
    while (!q.empty() && i < a.size()) {
        TreeNode* n = q.front(); q.pop();
        if (i < a.size() && a[i] != INT_MIN) { n->left = new TreeNode(a[i]); q.push(n->left); }
        i++;
        if (i < a.size() && a[i] != INT_MIN) { n->right = new TreeNode(a[i]); q.push(n->right); }
        i++;
    }
    return root;
}
static void _plist(ListNode* h) {
    cout << "[";
    for (ListNode* c = h; c; c = c->next) { cout << c->val; if (c->next) cout << ", "; }
    cout << "]";
}
static void _ptree(TreeNode* root) {
    vector<string> out; queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        TreeNode* n = q.front(); q.pop();
        if (!n) { out.push_back("null"); continue; }
        out.push_back(to_string(n->val)); q.push(n->left); q.push(n->right);
    }
    while (!out.empty() && out.back() == "null") out.pop_back();
    cout << "[";
    for (size_t i = 0; i < out.size(); i++) { cout << out[i]; if (i + 1 < out.size()) cout << ", "; }
    cout << "]";
}"""


def generate_cpp_test_harness(request: ExecutionRequest) -> str:
    sig = request.functionSignature
    cases_code_parts = []
    for tc in request.testCases:
        arg_vars = []
        case_code = """
        try {
            auto _start = std::chrono::high_resolution_clock::now();"""
        for i, param in enumerate(sig.parameters):
            val = _json_to_cpp_literal(tc.input[param.name], param.type)
            case_code += f"""
            auto arg{i} = {val};"""
            arg_vars.append(f"arg{i}")
            
        args_str = ", ".join(arg_vars)
        print_stmt = _cpp_print_for_type(sig.returnType)
        safe_id = tc.id.replace('"', '\\"')

        case_code += f"""
            {sig.className} sol;  // a fresh object per test, as on LeetCode
            auto res = sol.{sig.methodName}({args_str});
            auto _end = std::chrono::high_resolution_clock::now();
            auto runtimeMs = std::chrono::duration_cast<std::chrono::milliseconds>(_end - _start).count();
            std::cout << "{{\\"id\\": \\"{safe_id}\\", \\"runtimeMs\\": " << runtimeMs << ", \\"actualOutput\\": ";
            {print_stmt}
            std::cout << "}}" << std::endl;
        }} catch (const std::exception& _ex) {{
            std::string msg = _ex.what();
            std::cout << "{{\\"id\\": \\"{safe_id}\\", \\"error\\": \\"" << msg << "\\"}}" << std::endl;
        }} catch (...) {{
            std::cout << "{{\\"id\\": \\"{safe_id}\\", \\"error\\": \\"Unknown error\\"}}" << std::endl;
        }}"""
        cases_code_parts.append(case_code)

    all_cases = "\n".join(cases_code_parts)

    return f"""#include <bits/stdc++.h>

using namespace std;

{CPP_NODES}

static string _q(const string& s) {{  // JSON-quote a string for the result line
    string o = "\\"";
    for (char c : s) {{
        if (c == '"' || c == '\\\\') {{ o += '\\\\'; o += c; }}
        else if (c == '\\n') o += "\\\\n";
        else o += c;
    }}
    return o + "\\"";
}}

{request.code}

int main() {{
    std::cout << std::setprecision(12);

{all_cases}
    return 0;
}}
"""


def execute_cpp(request: ExecutionRequest) -> ExecutionResult:
    with tempfile.TemporaryDirectory() as tmpdir:
        sol_path = os.path.join(tmpdir, "main.cpp")
        harness_code = generate_cpp_test_harness(request)
        with open(sol_path, "w", encoding="utf-8") as f:
            f.write(harness_code)

        compile_cmd = ["g++", "-O2", "-std=c++17", "main.cpp", "-o", "main"]

        try:
            compile_res = run_sandboxed(compile_cmd, tmpdir, timeout=30)
            if compile_res.returncode != 0:
                error_text = (compile_res.stderr.strip() or compile_res.stdout.strip())
                # Just return raw compiler error for C++ for now
                return ExecutionResult(
                    status="compile_error",
                    passedTests=0,
                    totalTests=len(request.testCases),
                    testResults=[],
                    compilerError=error_text,
                )
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                status="compile_error",
                passedTests=0,
                totalTests=len(request.testCases),
                testResults=[],
                compilerError="Compilation timed out (30s limit).",
            )

        exec_cmd = ["./main"]

        try:
            exec_res = run_sandboxed(exec_cmd, tmpdir, timeout=6)
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                status="time_limit", passedTests=0, totalTests=len(request.testCases),
                testResults=[], runtimeError="Time Limit Exceeded (5000ms)"
            )

        return parse_execution_output(exec_res, request)


def parse_execution_output(exec_res, request: ExecutionRequest) -> ExecutionResult:
    results_dict: Dict[str, Any] = {}
    for line in exec_res.stdout.splitlines():
        line = line.strip()
        if line.startswith("{") and line.endswith("}"):
            try:
                parsed = json.loads(line)
                if "id" in parsed:
                    results_dict[parsed["id"]] = parsed
            except json.JSONDecodeError:
                pass

    test_results: List[TestCaseResult] = []
    passed_count = 0
    has_runtime_error = False

    for tc in request.testCases:
        raw = results_dict.get(tc.id, {})
        error = raw.get("error")
        actual_out = raw.get("actualOutput")
        runtime = int(raw.get("runtimeMs", 0))

        if error:
            status = "runtime_error"
            has_runtime_error = True
        elif "actualOutput" in raw:
            if compare_output(tc.expectedOutput, actual_out):
                status = "passed"
                passed_count += 1
            else:
                status = "wrong_answer"
        else:
            status = "runtime_error"
            error = "No output was produced for this test case."
            has_runtime_error = True

        test_results.append(TestCaseResult(
            id=tc.id,
            status=status,
            input=tc.input,
            expectedOutput=tc.expectedOutput,
            actualOutput=actual_out if "actualOutput" in raw else None,
            runtimeMs=runtime,
            error=error,
        ))

    if has_runtime_error:
        overall_status = "runtime_error"
    elif passed_count < len(request.testCases):
        overall_status = "wrong_answer"
    else:
        overall_status = "accepted"

    stderr_text = exec_res.stderr.strip() if exec_res.stderr.strip() else None

    return ExecutionResult(
        status=overall_status,
        passedTests=passed_count,
        totalTests=len(request.testCases),
        runtimeMs=sum((tr.runtimeMs or 0) for tr in test_results),
        testResults=test_results,
        runtimeError=stderr_text if has_runtime_error else None,
    )
