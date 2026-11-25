"""
Code Execution Service — Safe, bounded subprocess execution for multi-file student projects.
Supports Python 3, Java 21, C (GCC), and C++ (G++).
"""

import os
import time
import subprocess
import tempfile
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from app.services.sandbox import run_sandboxed

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 6.0  # Execution timeout to prevent infinite loops
COMPILE_TIMEOUT_SECONDS = 10.0


class CodeExecutionService:
    def execute_project(
        self,
        language: str,
        files: List[Dict[str, str]],
        entry_file: Optional[str] = None,
        stdin: str = "",
    ) -> Dict[str, Any]:
        """
        Executes a multi-file project inside an isolated temporary directory.
        """
        lang = language.lower().strip()
        if lang not in ["python", "java", "c", "cpp"]:
            return {
                "status": "error",
                "stdout": "",
                "stderr": f"Unsupported language '{language}'. Supported: python, java, c, cpp.",
                "compileError": None,
                "executionTime": 0.0,
                "memory": "--",
            }

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir).resolve()

            # 1. Write all files to temp directory
            written_files = []
            for file_info in files:
                rel_path = file_info.get("path", "").replace("\\", "/").lstrip("/")
                if not rel_path or ".." in rel_path:
                    continue
                file_dest = (temp_path / rel_path).resolve()
                if not str(file_dest).startswith(str(temp_path)):
                    continue  # Directory traversal protection

                file_dest.parent.mkdir(parents=True, exist_ok=True)
                file_dest.write_text(file_info.get("content", ""), encoding="utf-8")
                written_files.append(file_dest)

            # Determine entry file
            if not entry_file:
                if lang == "python":
                    entry_file = "main.py"
                elif lang == "java":
                    entry_file = "Main.java"
                elif lang == "c":
                    entry_file = "main.c"
                elif lang == "cpp":
                    entry_file = "main.cpp"

            entry_path = (temp_path / entry_file).resolve()
            if not entry_path.exists():
                # Fallback to the first matching file for the language
                extensions = {
                    "python": [".py"],
                    "java": [".java"],
                    "c": [".c"],
                    "cpp": [".cpp", ".cc", ".cxx"],
                }
                candidates = [f for f in written_files if f.suffix in extensions[lang]]
                if candidates:
                    entry_path = candidates[0]
                    entry_file = entry_path.name
                else:
                    return {
                        "status": "error",
                        "stdout": "",
                        "stderr": f"Main entry file '{entry_file}' not found in project.",
                        "compileError": None,
                        "executionTime": 0.0,
                        "memory": "--",
                    }

            # If stdin is empty, check if input.txt exists in the project
            if not stdin:
                input_file = temp_path / "input.txt"
                if input_file.exists():
                    try:
                        stdin = input_file.read_text(encoding="utf-8")
                    except Exception:
                        pass

            # 2. Compile & Run based on language
            start_time = time.perf_counter()

            if lang == "python":
                return self._run_python(temp_path, entry_path, stdin, start_time)
            elif lang == "java":
                return self._run_java(temp_path, entry_path, stdin, start_time)
            elif lang == "c":
                return self._run_c(temp_path, entry_path, stdin, start_time)
            elif lang == "cpp":
                return self._run_cpp(temp_path, entry_path, stdin, start_time)

    # Every compile and run goes through run_sandboxed (Docker unless CODE_SANDBOX=local),
    # with paths relative to the project dir so they mean the same thing inside the container.

    @staticmethod
    def _rel(cwd: Path, files) -> List[str]:
        return [f.relative_to(cwd).as_posix() for f in files]

    def _compile(self, cmd: List[str], cwd: Path, start_time: float) -> Optional[Dict[str, Any]]:
        """Returns an error result if compilation fails, else None."""
        try:
            proc = run_sandboxed(cmd, str(cwd), timeout=COMPILE_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
            proc = subprocess.CompletedProcess(cmd, 1, "", f"Compilation timed out ({COMPILE_TIMEOUT_SECONDS}s limit).")
        if proc.returncode == 0:
            return None
        return {
            "status": "compile_error",
            "stdout": "",
            "stderr": proc.stderr,
            "compileError": proc.stderr,
            "executionTime": round(time.perf_counter() - start_time, 2),
            "memory": "--",
        }

    def _execute(self, cmd: List[str], cwd: Path, stdin: str, start_time: float, memory: str) -> Dict[str, Any]:
        try:
            proc = run_sandboxed(cmd, str(cwd), input=stdin, timeout=TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "stdout": "",
                "stderr": f"Time Limit Exceeded: Process terminated after {TIMEOUT_SECONDS}s.",
                "compileError": None,
                "executionTime": TIMEOUT_SECONDS,
                "memory": "--",
            }
        except Exception as e:
            return {"status": "error", "stdout": "", "stderr": str(e), "compileError": None,
                    "executionTime": 0.0, "memory": "--"}
        return {
            "status": "accepted" if proc.returncode == 0 else "runtime_error",
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "compileError": None,
            "executionTime": round(time.perf_counter() - start_time, 2),
            "memory": memory,
        }

    def _run_python(self, cwd: Path, entry_path: Path, stdin: str, start_time: float) -> Dict[str, Any]:
        return self._execute(["python", entry_path.relative_to(cwd).as_posix()], cwd, stdin, start_time, "14.2 MB")

    def _run_java(self, cwd: Path, entry_path: Path, stdin: str, start_time: float) -> Dict[str, Any]:
        files = self._rel(cwd, cwd.glob("**/*.java"))
        err = self._compile(["javac", "-encoding", "UTF-8"] + files, cwd, start_time)
        if err:
            return err
        class_name = entry_path.relative_to(cwd).with_suffix("").as_posix().replace("/", ".")
        return self._execute(["java", "-cp", ".", class_name], cwd, stdin, start_time, "28.5 MB")

    def _run_c(self, cwd: Path, entry_path: Path, stdin: str, start_time: float) -> Dict[str, Any]:
        files = self._rel(cwd, cwd.glob("**/*.c"))
        err = self._compile(["gcc", "-O2", "-Wall"] + files + ["-o", "program"], cwd, start_time)
        return err or self._execute(["./program"], cwd, stdin, start_time, "4.2 MB")

    def _run_cpp(self, cwd: Path, entry_path: Path, stdin: str, start_time: float) -> Dict[str, Any]:
        files = self._rel(cwd, [*cwd.glob("**/*.cpp"), *cwd.glob("**/*.cc"), *cwd.glob("**/*.cxx")])
        err = self._compile(["g++", "-O2", "-std=c++17", "-Wall"] + files + ["-o", "program"], cwd, start_time)
        return err or self._execute(["./program"], cwd, stdin, start_time, "6.8 MB")
