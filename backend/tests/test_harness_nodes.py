"""Tree / linked-list support in the generated test harnesses, and a fresh Solution per test case."""
import json
from pathlib import Path

from app.services.execution_service import (
    ExecutionRequest,
    generate_cpp_test_harness,
    generate_java_test_harness,
    generate_python_test_harness,
)
from app.services.problem_registry import get_hidden_tests


def _req(lang):
    return ExecutionRequest(
        code="",
        problemId="c-invert-tree",
        functionSignature={"language": lang, "className": "Solution", "methodName": "invertTree", "returnType": "TreeNode", "parameters": [{"name": "root", "type": "TreeNode"}]},
        testCases=[{"id": "a", "input": {"root": [1, None, 2]}, "expectedOutput": [1, 2]}, {"id": "b", "input": {"root": []}, "expectedOutput": []}],
    )


def test_tree_literals_and_fresh_instances():
    java, py, cpp = generate_java_test_harness(_req("java")), generate_python_test_harness(_req("python")), generate_cpp_test_harness(_req("cpp"))
    assert "TreeNode.fromArray(new Integer[]{1, null, 2})" in java and "TreeNode.printTree(res)" in java
    assert "_to_tree([1, None, 2])" in py and "_plain(res, True)" in py
    assert "_mktree({1, INT_MIN, 2})" in cpp and "_ptree(res);" in cpp
    for code, new in ((java, "new Solution()"), (py, "sol = Solution()"), (cpp, "Solution sol;")):
        assert code.count(new) == 2, "each test case gets its own Solution object"


def test_core_problems_have_hidden_tests_on_the_server():
    core = json.loads((Path(__file__).resolve().parents[2] / "frontend/lib/problems/core.json").read_text(encoding="utf-8"))
    assert len(core) >= 80
    assert all(get_hidden_tests(pid) for pid in core), "every core problem is graded on hidden tests at submit"
