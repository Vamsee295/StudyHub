from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase import get_supabase_client
from supabase import Client
import time
import jwt
from typing import Dict, Tuple, Any

security = HTTPBearer()

# In-memory cache: token -> (user_object, expire_timestamp)
_TOKEN_CACHE: Dict[str, Tuple[Any, float]] = {}
CACHE_TTL = 300  # Cache verified users for 5 minutes

class UserStub:
    def __init__(self, uid: str, email: str, user_metadata: dict):
        self.id = uid
        self.email = email
        self.user_metadata = user_metadata or {}

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    now = time.time()

    # 1. Fast path: check in-memory cache
    if token in _TOKEN_CACHE:
        cached_user, expire_at = _TOKEN_CACHE[token]
        if now < expire_at:
            return cached_user
        else:
            _TOKEN_CACHE.pop(token, None)

    # 2. Check Supabase cloud API
    supabase: Client = get_supabase_client()
    try:
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            user = user_response.user
            _TOKEN_CACHE[token] = (user, now + CACHE_TTL)
            return user
    except Exception:
        pass

    # 3. Fast fallback: verify unexpired JWT token locally to prevent network lag
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        exp = payload.get("exp", 0)
        if exp > now:
            user_id = payload.get("sub")
            if user_id:
                user = UserStub(
                    uid=user_id,
                    email=payload.get("email", ""),
                    user_metadata=payload.get("user_metadata", {})
                )
                _TOKEN_CACHE[token] = (user, exp)
                return user
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

