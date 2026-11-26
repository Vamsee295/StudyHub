"""Submit stores the code and verdict; learners can list and open only their own submissions."""
import asyncio

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

import app.api.routes.execution as execution
from app.core.database import Base
from app.core.security import get_current_user
from app.main import app
from app.services import submissions_service
from app.services.execution_service import ExecutionResult, TestCaseResult


class _User:
    def __init__(self, uid):
        self.id = uid


def _fake_run(request):
    ok = "return a + b" in request.code
    return ExecutionResult(
        status="accepted" if ok else "wrong_answer",
        passedTests=len(request.testCases) if ok else 0,
        totalTests=len(request.testCases),
        runtimeMs=3,
        testResults=[TestCaseResult(id=t.id, status="passed" if ok else "wrong_answer", input=t.input, expectedOutput=t.expectedOutput, actualOutput=t.expectedOutput if ok else 0) for t in request.testCases],
    )


def _req(code):
    return {
        "code": code,
        "problemId": "c-sum-test",
        "functionSignature": {"language": "python", "className": "Solution", "methodName": "add", "returnType": "int", "parameters": [{"name": "a", "type": "int"}, {"name": "b", "type": "int"}]},
        "testCases": [{"id": "case-1", "input": {"a": 1, "b": 2}, "expectedOutput": 3}],
    }


def test_submissions_are_stored_and_private(tmp_path, monkeypatch):
    engine = create_async_engine(f"sqlite+aiosqlite:///{(tmp_path / 'subs.db').as_posix()}")

    async def setup():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(setup())
    monkeypatch.setattr(execution, "AsyncSessionLocal", async_sessionmaker(engine, expire_on_commit=False))
    monkeypatch.setattr(execution, "route_execution", _fake_run)
    monkeypatch.setattr(submissions_service, "KEEP_PER_PROBLEM", 3)
    who = {"u": _User("alice")}
    app.dependency_overrides[get_current_user] = lambda: who["u"]
    c = TestClient(app)
    try:
        wrong = c.post("/api/execution/submit", json=_req("return a - b")).json()
        right = c.post("/api/execution/submit", json=_req("return a + b")).json()
        assert wrong["status"] == "wrong_answer" and right["status"] == "accepted" and right["submissionId"]

        listed = c.get("/api/execution/submissions", params={"problem_id": "c-sum-test"}).json()
        assert listed["total"] == 2 and [i["status"] for i in listed["items"]] == ["accepted", "wrong_answer"]
        assert "code" not in listed["items"][0], "lists stay light; code comes with the detail"

        detail = c.get(f"/api/execution/submissions/{wrong['submissionId']}").json()
        assert detail["code"] == "return a - b" and detail["failedCase"]["expectedOutput"] == 3

        for _ in range(3):
            c.post("/api/execution/submit", json=_req("return a + b"))
        assert c.get("/api/execution/submissions").json()["total"] == 3, "history is trimmed per problem"

        sid = c.get("/api/execution/submissions").json()["items"][0]["id"]
        assert c.patch(f"/api/execution/submissions/{sid}", json={"note": "  used a hash map  "}).json()["note"] == "used a hash map"
        assert c.get("/api/execution/submissions").json()["items"][0]["note"] == "used a hash map", "notes show in the list"

        who["u"] = _User("bob")
        assert c.get(f"/api/execution/submissions/{right['submissionId']}").status_code == 404
        assert c.patch(f"/api/execution/submissions/{sid}", json={"note": "mine now"}).status_code == 404
        assert c.get("/api/execution/submissions").json()["total"] == 0
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        asyncio.run(engine.dispose())
