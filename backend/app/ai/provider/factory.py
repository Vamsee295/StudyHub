"""
Picks the AI provider. Each request uses ONE provider: the primary. Only if that call fails (bad key,
no credits, rate limit, outage, unparseable output) is the same request retried on the backup, and a
failed provider is skipped for a few minutes so students don't wait on it again and again.

LLM_PROVIDER=auto (default) puts Groq first, then Ollama. LLM_PROVIDER=groq or =ollama puts that one first.
A provider counts only when its settings are present (GROQ_API_KEY; OLLAMA_BASE_URL or OLLAMA_API_KEY).
"""
import logging
import time
from typing import Any, AsyncGenerator, Optional

from app.ai.provider.base import BaseAIProvider
from app.core.config import settings

logger = logging.getLogger(__name__)
COOLDOWN = 300  # seconds a failed provider is skipped

_provider_instance: Optional[BaseAIProvider] = None


def _order() -> list[str]:
    available = [n for n, ok in (("groq", bool(settings.groq_api_key)), ("ollama", bool(settings.ollama_api_key or settings.ollama_base_url))) if ok]
    first = settings.llm_provider.lower()
    return sorted(available, key=lambda n: n != first)  # the named provider first, the rest keep their order


def configured_provider_name() -> Optional[str]:
    order = _order()
    return order[0] if order else None


def _make(name: str) -> BaseAIProvider:
    if name == "groq":
        from app.ai.provider.groq_impl import GroqProvider

        return GroqProvider()
    from app.ai.provider.ollama_impl import OllamaProvider

    return OllamaProvider()


class FallbackProvider(BaseAIProvider):
    def __init__(self, providers: list[BaseAIProvider]):
        self.providers = providers
        self._down_until: dict[str, float] = {}

    def _candidates(self) -> list[BaseAIProvider]:
        now = time.time()
        up = [p for p in self.providers if self._down_until.get(p.provider_name, 0) <= now]
        return up or self.providers  # all cooling down: try them anyway rather than fail outright

    def _failed(self, p: BaseAIProvider, e: Exception) -> None:
        self._down_until[p.provider_name] = time.time() + COOLDOWN
        logger.warning("AI provider %s failed (%s: %s); using the backup if there is one", p.provider_name, type(e).__name__, str(e)[:200])

    async def _first_success(self, call):
        last: Exception | None = None
        for p in self._candidates():
            try:
                result = await call(p)
                self._down_until.pop(p.provider_name, None)
                return result
            except Exception as e:  # noqa: BLE001 - any failure moves on to the backup
                self._failed(p, e)
                last = e
        assert last is not None
        raise last

    async def generate(self, messages, max_tokens=1024, temperature=0.7, **kwargs) -> tuple[str, dict[str, int]]:
        return await self._first_success(lambda p: p.generate(messages, max_tokens=max_tokens, temperature=temperature, **kwargs))

    async def structured_output(self, messages, schema, max_tokens=2048, **kwargs):
        return await self._first_success(lambda p: p.structured_output(messages, schema, max_tokens=max_tokens, **kwargs))

    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        return await self._first_success(lambda p: p.get_embeddings(texts))

    async def stream(self, messages, max_tokens=1024, temperature=0.7, **kwargs) -> AsyncGenerator[str, None]:
        # falls back only if nothing was sent yet; a stream that breaks halfway can't be restarted cleanly
        last: Exception | None = None
        for p in self._candidates():
            started = False
            try:
                async for piece in p.stream(messages, max_tokens=max_tokens, temperature=temperature, **kwargs):
                    started = True
                    yield piece
                return
            except Exception as e:  # noqa: BLE001
                if started:
                    raise
                self._failed(p, e)
                last = e
        if last:
            raise last

    @property
    def provider_name(self) -> str:
        return self._candidates()[0].provider_name

    @property
    def default_model(self) -> str:
        return self._candidates()[0].default_model


def get_ai_provider() -> BaseAIProvider:
    global _provider_instance
    if _provider_instance is None:
        order = _order()
        if not order:
            raise ValueError("No AI provider configured: set GROQ_API_KEY, or OLLAMA_BASE_URL / OLLAMA_API_KEY")
        _provider_instance = FallbackProvider([_make(n) for n in order])
    return _provider_instance
