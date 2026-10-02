"""
End-to-end validation of the execution service.
Run: python test_execution.py
Requires: Docker Desktop running + eclipse-temurin:21-jdk-alpine pulled.
"""

import sys
import json
sys.path.insert(0, ".")

from app.services.execution_service import (
    execute_java, ExecutionRequest, FunctionSignature, ParameterDef, TestCase
)

SIGNATURE = FunctionSignature(
    language="java",
    className="Solution",
    methodName="search",
    returnType="int",
    parameters=[
        ParameterDef(name="nums", type="int[]"),
        ParameterDef(name="target", type="int"),
    ],
)

TEST_CASES = [
    TestCase(id="case-1", input={"nums": [4, 5, 6, 7, 0, 1, 2], "target": 0}, expectedOutput=4),
    TestCase(id="case-2", input={"nums": [4, 5, 6, 7, 0, 1, 2], "target": 3}, expectedOutput=-1),
    TestCase(id="case-3", input={"nums": [1], "target": 0}, expectedOutput=-1),
]

CORRECT = """
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}
"""

WRONG = """
class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}
"""

COMPILE_ERROR = """
class Solution {
    public int search(int[] nums, int target) {
        this is not valid java
    }
}
"""

RUNTIME_ERROR = """
class Solution {
    public int search(int[] nums, int target) {
        throw new RuntimeException("deliberate error");
    }
}
"""

INFINITE_LOOP = """
class Solution {
    public int search(int[] nums, int target) {
        long x = 0;
        while (x >= 0) { x++; if (x < 0) break; }
        return -1;
    }
}
"""


def run_test(name, code, expected_status):
    req = ExecutionRequest(
        code=code,
        problemId="33",
        functionSignature=SIGNATURE,
        testCases=TEST_CASES,
    )
    result = execute_java(req)
    ok = result.status == expected_status
    print(f"{'PASS' if ok else 'FAIL'} [{name}]  status={result.status}  passed={result.passedTests}/{result.totalTests}")
    if not ok:
        print(f"  Expected status: {expected_status}")
        if result.compilerError:
            print(f"  compilerError: {result.compilerError[:200]}")
        if result.runtimeError:
            print(f"  runtimeError: {result.runtimeError[:200]}")
        for tr in result.testResults[:2]:
            print(f"  case {tr.id}: status={tr.status} actual={tr.actualOutput} expected={tr.expectedOutput}")
    return ok


if __name__ == "__main__":
    print("=" * 60)
    print("StudyHub Execution Service — End-to-End Validation")
    print("=" * 60)

    results = [
        run_test("Correct solution",   CORRECT,       "accepted"),
        run_test("Always-wrong",       WRONG,         "wrong_answer"),
        run_test("Compile error",      COMPILE_ERROR, "compile_error"),
        run_test("Runtime error",      RUNTIME_ERROR, "runtime_error"),
        run_test("TLE (infinite loop)",INFINITE_LOOP, "time_limit"),
    ]

    passed = sum(results)
    total = len(results)
    print("=" * 60)
    print(f"Result: {passed}/{total} tests passed")
    if passed < total:
        sys.exit(1)
