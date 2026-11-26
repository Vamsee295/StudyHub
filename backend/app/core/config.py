from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    environment: str = "development"
    
    # Supabase (Auth, Storage, Edge)
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    
    # Database (PostgreSQL via asyncpg or SQLite fallback)
    database_url: str = "sqlite+aiosqlite:///./pathward.db"
    
    # AI: one provider answers each request; the other is the backup if it fails (app/ai/provider/factory.py).
    # LLM_PROVIDER = auto (Groq first) | groq | ollama (that one first)
    llm_provider: str = "auto"
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    # Ollama: a local server (http://localhost:11434, no key) or Ollama Cloud (https://ollama.com plus OLLAMA_API_KEY)
    ollama_base_url: str = ""
    ollama_api_key: str = ""
    ollama_model: str = "gpt-oss:120b"
    ollama_embed_model: str = "nomic-embed-text"
    
    # CORS
    frontend_url: str = "http://localhost:3000"


    # Where student code runs: "docker" (isolated container, the default) or
    # "local" (plain host process; development only, set CODE_SANDBOX=local in .env).
    code_sandbox: str = "docker"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
