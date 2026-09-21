from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    environment: str = "development"
    
    # Supabase (Auth, Storage, Edge)
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    
    # Database (PostgreSQL via asyncpg or SQLite fallback)
    database_url: str = "sqlite+aiosqlite:///./pathward.db"
    
    # Groq LLM
    groq_api_key: str = ""
    groq_model: str = "llama3-8b-8192"
    
    # CORS
    frontend_url: str = "http://localhost:3000"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
