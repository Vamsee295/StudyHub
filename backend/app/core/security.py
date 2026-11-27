from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.supabase import get_supabase_client
from supabase import Client
import time
import jwt
from datetime import datetime, timezone
from typing import Dict, Tuple, Any, Optional

security = HTTPBearer()

# In-memory cache: token -> (user_object, expire_timestamp)
_TOKEN_CACHE: Dict[str, Tuple[Any, float]] = {}
CACHE_TTL = 300  # Cache verified users for 5 minutes

# Supabase publishes its asymmetric signing keys here; PyJWKClient fetches lazily and caches them
_jwks_client = (
    jwt.PyJWKClient(f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json")
    if settings.supabase_url
    else None
)

class UserStub:
    def __init__(self, uid: str, email: str, user_metadata: dict, app_metadata: Optional[dict] = None):
        self.id = uid
        self.email = email
        self.user_metadata = user_metadata or {}
        self.app_metadata = app_metadata or {}
        self.banned_until = None  # not in the token; only the Supabase lookup knows


def _is_suspended(user: Any) -> bool:
    """Suspended by an admin (Supabase banned_until in the future). Suspended accounts can't sign in again,
    but an access token issued before the suspension stays valid until it expires, so block it here too."""
    until = getattr(user, "banned_until", None)
    if not until:
        return False
    if isinstance(until, str):
        try:
            until = datetime.fromisoformat(until.replace("Z", "+00:00"))
        except ValueError:
            return False
    if until.tzinfo is None:
        until = until.replace(tzinfo=timezone.utc)
    return until > datetime.now(timezone.utc)


def is_admin(user: Any) -> bool:
    """Admin role from Supabase app_metadata, which only the server side (SQL / service role) can set."""
    meta = getattr(user, "app_metadata", None) or {}
    return meta.get("role") == "admin"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = _verify(credentials.credentials)
    if _is_suspended(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account is suspended")
    return user


def require_admin(user: Any = Depends(get_current_user)):
    """Only admins. Everyone else gets a 404, so the admin API doesn't advertise itself."""
    if not is_admin(user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return user


def _verify(token: str):
    now = time.time()

    # 1. Fast path: check in-memory cache
    if token in _TOKEN_CACHE:
        cached_user, expire_at = _TOKEN_CACHE[token]
        if now < expire_at:
            return cached_user
        else:
            _TOKEN_CACHE.pop(token, None)

    # 2. Check Supabase cloud API
    try:
        supabase: Client = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            user = user_response.user
            _TOKEN_CACHE[token] = (user, now + CACHE_TTL)
            return user
    except Exception:
        pass

    # 3. Fallback when Supabase is unreachable: verify signature, expiry and audience locally
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
            options={"require": ["exp", "sub"]},
        )
        user = UserStub(
            uid=payload["sub"],
            email=payload.get("email", ""),
            user_metadata=payload.get("user_metadata", {}),
            app_metadata=payload.get("app_metadata", {}),
        )
        _TOKEN_CACHE[token] = (user, payload["exp"])
        return user
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

