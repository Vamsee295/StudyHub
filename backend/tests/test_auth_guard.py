import base64
import json
import time

from fastapi.testclient import TestClient

from app.core import security
from app.main import app

client = TestClient(app)


def _forged_token():
    enc = lambda d: base64.urlsafe_b64encode(json.dumps(d).encode()).rstrip(b"=").decode()
    return f"{enc({'alg': 'none'})}.{enc({'sub': 'attacker', 'exp': time.time() + 3600})}.x"


def test_forged_unsigned_jwt_is_rejected(monkeypatch):
    class FakeAuth:
        def get_user(self, token):
            raise Exception("invalid token")

    class FakeSupabase:
        auth = FakeAuth()

    monkeypatch.setattr(security, "get_supabase_client", lambda: FakeSupabase())
    security._TOKEN_CACHE.clear()
    r = client.post("/api/execution/run", json={}, headers={"Authorization": f"Bearer {_forged_token()}"})
    assert r.status_code == 401


def test_execution_routes_require_auth():
    for path in ["/api/execution/run", "/api/execution/submit", "/api/execution/explain-error", "/api/practice/code/execute"]:
        assert client.post(path, json={}).status_code in (401, 403), path
