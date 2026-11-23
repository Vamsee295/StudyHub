"""Self-check for get_current_user's local JWT fallback. Run: python -m pytest tests/test_jwt_fallback.py"""
import time

import jwt
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core import security

real_key = ec.generate_private_key(ec.SECP256R1())
attacker_key = ec.generate_private_key(ec.SECP256R1())


class FakeJWKS:
    def get_signing_key_from_jwt(self, token):
        return type("K", (), {"key": real_key.public_key()})()


def offline_supabase():
    raise ConnectionError("supabase unreachable")


security._jwks_client = FakeJWKS()
security.get_supabase_client = offline_supabase


def claims(**over):
    c = {"sub": "victim-id", "aud": "authenticated", "exp": int(time.time()) + 3600}
    c.update(over)
    return c


def authenticate(token):
    security._TOKEN_CACHE.clear()
    try:
        return security.get_current_user(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token))
    except HTTPException as e:
        assert e.status_code == 401
        return None


def test_rejects_forged_tokens():
    assert authenticate(jwt.encode(claims(), key=None, algorithm="none")) is None
    assert authenticate(jwt.encode(claims(), "guessed-secret", algorithm="HS256")) is None
    assert authenticate(jwt.encode(claims(), attacker_key, algorithm="ES256")) is None
    assert authenticate(jwt.encode(claims(exp=int(time.time()) - 10), real_key, algorithm="ES256")) is None
    assert authenticate(jwt.encode(claims(aud="anon"), real_key, algorithm="ES256")) is None


def test_accepts_valid_token():
    user = authenticate(jwt.encode(claims(), real_key, algorithm="ES256"))
    assert user is not None and user.id == "victim-id"


if __name__ == "__main__":
    test_rejects_forged_tokens()
    test_accepts_valid_token()
    print("ok")
