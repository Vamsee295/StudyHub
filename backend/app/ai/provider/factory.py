from typing import Optional
from app.ai.provider.base import BaseAIProvider
from app.ai.provider.groq_impl import GroqProvider
from app.core.config import settings

_provider_instance: Optional[BaseAIProvider] = None

def get_ai_provider() -> BaseAIProvider:
    """
    Factory to get the configured AI provider.
    Currently defaults to Groq, but extensible via LLM_PROVIDER.
    """
    global _provider_instance
    
    if _provider_instance is not None:
        return _provider_instance
        
    provider_name = settings.LLM_PROVIDER.lower()
    
    if provider_name == "groq":
        _provider_instance = GroqProvider()
    else:
        # Fallback to groq if unknown
        _provider_instance = GroqProvider()
        
    return _provider_instance
