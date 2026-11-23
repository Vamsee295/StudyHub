"""
Bounded subprocess runner for untrusted student code.

- Child gets a minimal environment (no server secrets from os.environ).
- stdout/stderr are capped; the process is killed once the cap is hit.
- Process is killed on timeout and subprocess.TimeoutExpired is raised.

ponytail: this is NOT an OS sandbox. Code can still read files the server user
can read and use the network. Run the runners in a locked-down container
(no network, read-only FS, non-root, cgroup memory limit) before production.
"""

import os
import subprocess
import threading
from typing import List, Optional

MAX_OUTPUT_BYTES = 1024 * 1024  # 1 MB per stream
TRUNCATION_NOTICE = "\n[output truncated: limit of 1 MB reached]"

_SAFE_ENV_KEYS = ("PATH", "PATHEXT", "SYSTEMROOT", "WINDIR", "COMSPEC", "TEMP", "TMP", "LANG", "JAVA_HOME")


def _clean_env(cwd: str) -> dict:
    env = {k: os.environ[k] for k in _SAFE_ENV_KEYS if k in os.environ}
    env["HOME"] = cwd
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    return env


def run_sandboxed(
    cmd: List[str],
    cwd: str,
    input: Optional[str] = "",
    timeout: float = 6.0,
) -> subprocess.CompletedProcess:
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        env=_clean_env(cwd),
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    buffers = {"out": bytearray(), "err": bytearray()}
    truncated = {"out": False, "err": False}

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
                    proc.kill()
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
        proc.kill()
        proc.wait()
        for t in threads:
            t.join(timeout=1)
        raise subprocess.TimeoutExpired(cmd, timeout)

    for t in threads:
        t.join(timeout=1)

    def decode(key):
        text = buffers[key].decode("utf-8", errors="replace").replace("\r\n", "\n")
        return text + TRUNCATION_NOTICE if truncated[key] else text

    return subprocess.CompletedProcess(cmd, proc.returncode, decode("out"), decode("err"))
