from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Returns a standard Supabase client initialized with the Anon Key.
    Used for unprivileged operations that respect RLS.
    """
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise ValueError("Supabase URL and Anon Key are not configured in environment.")
    return create_client(settings.supabase_url, settings.supabase_anon_key)

def get_service_role_client() -> Client:
    """
    Returns a privileged Supabase client initialized with the Service Role Key.
    WARNING: Use this client ONLY for server-side operations that require bypassing RLS.
    NEVER expose this client or its key to the frontend.
    """
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise ValueError("Supabase URL and Service Role Key are not configured in environment.")
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
