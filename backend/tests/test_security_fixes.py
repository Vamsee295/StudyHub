import os
import subprocess
import sys

import pytest
from fastapi.testclient import TestClient

from app.api.routes import resume
from app.main import app
from app.services import sandbox
from app.services.resume_analysis_service import ResumeAnalysisService

client = TestClient(app)


# ── Runner sandbox ────────────────────────────────────────────────────────────

def test_sandbox_hides_server_env(tmp_path, monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "super-secret")
    r = sandbox.run_sandboxed(
        [sys.executable, "-c", "import os; print(os.environ.get('GROQ_API_KEY'))"], cwd=str(tmp_path)
    )
    assert r.stdout.strip() == "None"


def test_sandbox_caps_output(tmp_path):
    r = sandbox.run_sandboxed(
        [sys.executable, "-c", "while True: print('x' * 1000)"], cwd=str(tmp_path), timeout=10
    )
    assert r.stdout.endswith(sandbox.TRUNCATION_NOTICE)
    assert len(r.stdout) <= sandbox.MAX_OUTPUT_BYTES + len(sandbox.TRUNCATION_NOTICE)


def test_sandbox_timeout_and_stdin(tmp_path):
    with pytest.raises(subprocess.TimeoutExpired):
        sandbox.run_sandboxed([sys.executable, "-c", "while True: pass"], cwd=str(tmp_path), timeout=1)
    r = sandbox.run_sandboxed([sys.executable, "-c", "print(input()[::-1])"], cwd=str(tmp_path), input="abc\n")
    assert r.stdout.strip() == "cba"


# ── Resume auth / ownership / size ────────────────────────────────────────────

def test_resume_routes_require_auth():
    assert client.get("/api/resume/analyses/x").status_code in (401, 403)
    assert client.post("/api/resume/analyses/x/process").status_code in (401, 403)
    assert client.post("/api/resume/analyses", data={}).status_code in (401, 403)


@pytest.fixture
def as_user():
    app.dependency_overrides[resume.get_effective_user_id] = lambda: "intruder"
    yield
    app.dependency_overrides.clear()


def test_resume_analysis_scoped_to_owner(as_user, monkeypatch):
    seen = {}

    async def fake_get(self, analysis_id, user_id=None):
        seen["user_id"] = user_id
        return None

    monkeypatch.setattr(ResumeAnalysisService, "get_analysis", fake_get)
    assert client.get("/api/resume/analyses/someone-elses").status_code == 404
    assert seen["user_id"] == "intruder"


def test_resume_upload_size_cap(as_user):
    big = b"%PDF-1.4\n" + b"0" * (resume.MAX_UPLOAD_BYTES + 10)
    r = client.post(
        "/api/resume/analyses",
        data={"source": "pdf", "company": "A", "company_type": "product", "role": "SDE"},
        files={"file": ("r.pdf", big, "application/pdf")},
    )
    assert r.status_code == 413
