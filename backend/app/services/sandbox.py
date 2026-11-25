"""
The one place student code is started. Every compile and run goes through run_sandboxed().

Commands are written as they would run inside the container, relative to the work dir:
  ["python", "main.py"], ["javac", "Main.java"], ["java", "Main"], ["g++", "main.cpp", "-o", "main"], ["./main"]

CODE_SANDBOX=docker (default): each command runs in a throwaway container with
  no network, read-only root filesystem, the work dir as the only writable mount
  (plus a small /tmp tmpfs), memory/CPU/process limits, all capabilities dropped,
  no-new-privileges, and a non-root user.
CODE_SANDBOX=local: plain host process with a scrubbed environment. Development only;
  code can read files the server user can read and use the network.

In both modes stdout/stderr are capped and the process is killed on timeout
(subprocess.TimeoutExpired is raised, as subprocess.run would).
"""

import os
import subprocess
import sys
import threading
import uuid
from typing import List, Optional

from app.core.config import settings

MAX_OUTPUT_BYTES = 1024 * 1024  # 1 MB per stream
TRUNCATION_NOTICE = "\n[output truncated: limit of 1 MB reached]"

# One image per toolchain; compiled C/C++ binaries run in the image that built them.
IMAGES = {
    "python": "python:3.12-slim",
    "javac": "eclipse-temurin:21-jdk",
    "java": "eclipse-temurin:21-jdk",
    "gcc": "gcc:13",
    "g++": "gcc:13",
}
NATIVE_IMAGE = "gcc:13"

MEMORY = "256m"
CPUS = "1"
PIDS = "128"  # the JVM needs a few dozen threads

UNAVAILABLE = (
    "Code runner unavailable: Docker is not reachable. Start Docker, "
    "or for local development set CODE_SANDBOX=local in backend/.env."
)

_SAFE_ENV_KEYS = ("PATH", "PATHEXT", "SYSTEMROOT", "WINDIR", "COMSPEC", "TEMP", "TMP", "LANG", "JAVA_HOME")


def _clean_env(cwd: str) -> dict:
    env = {k: os.environ[k] for k in _SAFE_ENV_KEYS if k in os.environ}
    env["HOME"] = cwd
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    return env


def _local_cmd(cmd: List[str], cwd: str) -> List[str]:
    if cmd[0] == "python":
        return [sys.executable] + cmd[1:]
    if cmd[0].startswith("./"):
        exe = os.path.join(cwd, cmd[0][2:])
        if sys.platform == "win32" and not exe.endswith(".exe"):
            exe += ".exe"
        return [exe] + cmd[1:]
    return cmd


def _docker_cmd(cmd: List[str], cwd: str, name: str) -> List[str]:
    image = NATIVE_IMAGE if cmd[0].startswith("./") else IMAGES[cmd[0]]
    # Run as the server's own uid so the container can write the per-request work dir;
    # Docker Desktop (Windows/macOS) maps mount permissions itself, so use "nobody" there.
    user = f"{os.getuid()}:{os.getgid()}" if hasattr(os, "getuid") else "65534:65534"
    return [
        "docker", "run", "--rm", "-i", "--name", name,
        "--network", "none",
        "--read-only", "--tmpfs", "/tmp:rw,exec,size=64m",
        "--memory", MEMORY, "--memory-swap", MEMORY, "--cpus", CPUS, "--pids-limit", PIDS,
        "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--user", user,
        "-e", "HOME=/tmp", "-e", "PYTHONDONTWRITEBYTECODE=1", "-e", "PYTHONIOENCODING=utf-8",
        "-v", f"{os.path.abspath(cwd)}:/work", "-w", "/work",
        image,
    ] + cmd


def run_sandboxed(
    cmd: List[str],
    cwd: str,
    input: Optional[str] = "",
    timeout: float = 6.0,
) -> subprocess.CompletedProcess:
    mode = settings.code_sandbox.strip().lower()
    container = None
    if mode == "local":
        real_cmd = _local_cmd(cmd, cwd)
    elif mode == "docker":
        container = f"studyhub-run-{uuid.uuid4().hex[:12]}"
        real_cmd = _docker_cmd(cmd, cwd, container)
        # ponytail: container start adds ~0.5-1s, so allow a little headroom on top of the user limit.
        timeout += 3
    else:
        raise ValueError(f"CODE_SANDBOX must be 'docker' or 'local', not {settings.code_sandbox!r}")

    try:
        proc = subprocess.Popen(
            real_cmd,
            cwd=cwd,
            env=_clean_env(cwd) if mode == "local" else None,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except FileNotFoundError:
        if mode == "docker":
            return subprocess.CompletedProcess(cmd, 1, "", UNAVAILABLE)
        raise

    buffers = {"out": bytearray(), "err": bytearray()}
    truncated = {"out": False, "err": False}

    def kill():
        proc.kill()
        if container:  # killing the docker CLI does not stop the container
            subprocess.run(["docker", "kill", container], capture_output=True, timeout=10)

    def pump(stream, key):
        buf = buffers[key]
        while True:
            chunk = stream.read(65536)
            if not chunk:
                break
            room = MAX_OUTPUT_BYTES - len(buf)
            if len(chunk) > room:
                buf.extend(chunk[:room])
                if not truncated[key]:
                    truncated[key] = True
                    kill()
            else:
                buf.extend(chunk)

    def feed():
        try:
            if input:
                proc.stdin.write(input.encode("utf-8"))
        except OSError:
            pass  # child exited before reading all input
        finally:
            try:
                proc.stdin.close()
            except OSError:
                pass

    threads = [
        threading.Thread(target=pump, args=(proc.stdout, "out"), daemon=True),
        threading.Thread(target=pump, args=(proc.stderr, "err"), daemon=True),
        threading.Thread(target=feed, daemon=True),
    ]
    for t in threads:
        t.start()

    try:
        proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        kill()
        proc.wait()
        for t in threads:
            t.join(timeout=1)
        raise subprocess.TimeoutExpired(cmd, timeout)

    for t in threads:
        t.join(timeout=1)

    def decode(key):
        text = buffers[key].decode("utf-8", errors="replace").replace("\r\n", "\n")
        return text + TRUNCATION_NOTICE if truncated[key] else text

    err = decode("err")
    # 125 = docker itself failed (daemon down, image missing); don't blame the student's code.
    if container and proc.returncode == 125 and ("daemon" in err or "pipe" in err or "connect" in err):
        err = UNAVAILABLE + "\n" + err
    return subprocess.CompletedProcess(cmd, proc.returncode, decode("out"), err)
