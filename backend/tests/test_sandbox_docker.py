"""Docker sandbox isolation. The isolation tests skip unless Docker is running and the
runner images are already pulled (tests never pull images):
    docker pull python:3.12-slim eclipse-temurin:21-jdk gcc:13
"""
import subprocess

import pytest

from app.services import sandbox
from app.services.execution_service import ExecutionRequest, execute_cpp, execute_java
from app.services.execution_service import TestCase as Case


def _docker_ready() -> bool:
    try:
        if subprocess.run(["docker", "info"], capture_output=True, timeout=20).returncode != 0:
            return False
        images = set(sandbox.IMAGES.values()) | {sandbox.NATIVE_IMAGE}
        return all(
            subprocess.run(["docker", "image", "inspect", i], capture_output=True, timeout=20).returncode == 0
            for i in images
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


needs_docker = pytest.mark.skipif(not _docker_ready(), reason="Docker not running or runner images not pulled")


@pytest.fixture(autouse=True)
def _docker_mode(monkeypatch):
    monkeypatch.setattr(sandbox.settings, "code_sandbox", "docker")


def py(tmp_path, code, **kw):
    (tmp_path / "main.py").write_text(code, encoding="utf-8")
    return sandbox.run_sandboxed(["python", "main.py"], str(tmp_path), **kw)


# ── Always run: fail closed ───────────────────────────────────────────────────

def test_missing_docker_fails_closed(tmp_path, monkeypatch):
    monkeypatch.setattr(sandbox, "_docker_cmd", lambda cmd, cwd, name: ["no-such-docker-binary-xyz"] + cmd)
    r = py(tmp_path, "print('ran on host')")
    assert r.returncode != 0
    assert "ran on host" not in r.stdout
    assert r.stderr == sandbox.UNAVAILABLE


def test_unknown_mode_is_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(sandbox.settings, "code_sandbox", "off")
    with pytest.raises(ValueError):
        py(tmp_path, "print(1)")


# ── Isolation (real containers) ───────────────────────────────────────────────

@needs_docker
def test_no_network(tmp_path):
    r = py(tmp_path, (
        "import socket\n"
        "try:\n"
        "    socket.create_connection(('1.1.1.1', 53), timeout=3); print('CONNECTED')\n"
        "except OSError as e:\n"
        "    print('BLOCKED')\n"
    ))
    assert r.stdout.strip() == "BLOCKED", r.stderr


@needs_docker
def test_filesystem_read_only_outside_work_dir(tmp_path):
    r = py(tmp_path, (
        "import os\n"
        "for p in ['/etc/pwned', '/usr/pwned', '/pwned']:\n"
        "    try:\n"
        "        open(p, 'w').write('x'); print('WROTE', p)\n"
        "    except OSError:\n"
        "        print('DENIED', p)\n"
        "open('ok.txt', 'w').write('fine')\n"
        "print('uid', os.getuid())\n"
    ))
    lines = r.stdout.split("\n")
    assert [l for l in lines if l.startswith("DENIED")] == ["DENIED /etc/pwned", "DENIED /usr/pwned", "DENIED /pwned"], r.stderr
    assert (tmp_path / "ok.txt").read_text() == "fine"  # the work dir stays writable
    assert "uid 0" not in r.stdout  # not root


@needs_docker
def test_cannot_see_host_secrets(tmp_path, monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "super-secret")
    r = py(tmp_path, "import os; print(os.environ.get('GROQ_API_KEY'))")
    assert r.stdout.strip() == "None"


@needs_docker
def test_memory_limit_kills_process(tmp_path):
    r = py(tmp_path, "x = bytearray(1024 * 1024 * 1024); print('ALLOCATED')")
    assert "ALLOCATED" not in r.stdout
    assert r.returncode != 0


@needs_docker
def test_timeout_kills_container(tmp_path):
    with pytest.raises(subprocess.TimeoutExpired):
        py(tmp_path, "while True: pass", timeout=1)


@needs_docker
def test_judge_runs_java_and_cpp_in_container():
    sig = {"language": "java", "className": "Solution", "methodName": "add", "returnType": "int",
           "parameters": [{"name": "a", "type": "int"}, {"name": "b", "type": "int"}]}
    tests = [Case(id="case-1", input={"a": 2, "b": 3}, expectedOutput=5)]
    java = execute_java(ExecutionRequest(
        code="class Solution { public int add(int a, int b) { return a + b; } }",
        problemId="t", functionSignature=sig, testCases=tests))
    assert java.status == "accepted", java.compilerError or java.runtimeError
    cpp = execute_cpp(ExecutionRequest(
        code="class Solution { public: int add(int a, int b) { return a + b; } };",
        problemId="t", functionSignature=dict(sig, language="cpp"), testCases=tests))
    assert cpp.status == "accepted", cpp.compilerError or cpp.runtimeError
