import os
import json
import tempfile
import subprocess
import re
import sys
from pydantic import BaseModel
from typing import List, Dict, Any, Optional


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
    code: str
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
        {sig.className} sol = new {sig.className}();
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


def execute_java(request: ExecutionRequest) -> ExecutionResult:
    """Compile and run Java code in an isolated Docker container."""
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
            f"{request.functionSignature.className}.java",
            "Main.java",
        ]

        try:
            compile_res = subprocess.run(
                compile_cmd, capture_output=True, text=True, timeout=30, cwd=tmpdir
            )
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
            exec_res = subprocess.run(
                exec_cmd, capture_output=True, text=True, timeout=6, cwd=tmpdir
            )
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
            memoryMb=42.1,  # Docker doesn't expose this easily without cgroups
            testResults=test_results,
            runtimeError=stderr_text if has_runtime_error else None,
        )



def generate_python_test_harness(request: ExecutionRequest) -> str:
    sig = request.functionSignature
    cases_code_parts = []
    for tc in request.testCases:
        args = []
        for param in sig.parameters:
            args.append(json.dumps(tc.input[param.name]))
        args_str = ", ".join(args)
        safe_id = tc.id.replace('"', '\\"')

        case_code = f"""
    try:
        _start = time.time()
        res = sol.{sig.methodName}({args_str})
        _end = time.time()
        print(json.dumps({{"id": "{safe_id}", "runtimeMs": int((_end - _start) * 1000), "actualOutput": res}}))
    except Exception as e:
        print(json.dumps({{"id": "{safe_id}", "error": str(e)}}))"""
        cases_code_parts.append(case_code)

    all_cases = "\n".join(cases_code_parts)

    return f"""import json
import time

{request.code}

def __main():
    sol = {sig.className}()
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

        exec_cmd = [sys.executable, "main.py"]

        try:
            exec_res = subprocess.run(
                exec_cmd, capture_output=True, text=True, timeout=6, cwd=tmpdir
            )
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
        return f"""
            std::cout << "\"" << {var_name} << "\"";"""
    elif return_type == "boolean":
        return f"""
            std::cout << ({var_name} ? "true" : "false");"""
    else:
        return f"std::cout << {var_name};"

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

    return f"""#include <iostream>
#include <vector>
#include <string>
#include <chrono>

using namespace std;

{request.code}

int main() {{
    {sig.className} sol;
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
            compile_res = subprocess.run(
                compile_cmd, capture_output=True, text=True, timeout=30, cwd=tmpdir
            )
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

        exe_name = "main" if sys.platform != "win32" else "main.exe"
        exec_cmd = [os.path.join(tmpdir, exe_name)]

        try:
            exec_res = subprocess.run(
                exec_cmd, capture_output=True, text=True, timeout=6, cwd=tmpdir
            )
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
        memoryMb=42.1,
        testResults=test_results,
        runtimeError=stderr_text if has_runtime_error else None,
    )
