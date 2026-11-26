"""Ollama provider: a local server (http://localhost:11434) or Ollama Cloud (https://ollama.com with an API key)."""
import json
from typing import Any, AsyncGenerator, TypeVar

import httpx
from pydantic import BaseModel

from app.ai.provider.base import BaseAIProvider
from app.core.config import settings

T = TypeVar("T", bound=BaseModel)


class OllamaProvider(BaseAIProvider):
    def __init__(self):
        headers = {"Authorization": f"Bearer {settings.ollama_api_key}"} if settings.ollama_api_key else {}
        self.client = httpx.AsyncClient(base_url=settings.ollama_base_url.rstrip("/"), headers=headers, timeout=120)

    @property
    def provider_name(self) -> str:
        return "ollama"

    @property
    def default_model(self) -> str:
        return settings.ollama_model

    async def _chat(self, messages, max_tokens, temperature, fmt=None, stream=False):
        body: dict[str, Any] = {
            "model": self.default_model,
            "messages": messages,
            "stream": stream,
            "options": {"num_predict": max_tokens, "temperature": temperature},
        }
        if fmt:
            body["format"] = fmt
        if "gpt-oss" in self.default_model:
            body["think"] = "low"  # thinking counts against num_predict; keep it short
        return body

    async def generate(self, messages, max_tokens=1024, temperature=0.7, **kwargs) -> tuple[str, dict[str, int]]:
        r = await self.client.post("/api/chat", json=await self._chat(messages, max_tokens, temperature, kwargs.get("format")))
        if r.is_error:
            # keep Ollama's reason ("add usage credits", "model not found") in the error for the logs
            raise httpx.HTTPStatusError(f"Ollama {r.status_code}: {r.text[:200]}", request=r.request, response=r)
        data = r.json()
        p, c = data.get("prompt_eval_count", 0), data.get("eval_count", 0)
        return data["message"]["content"], {"prompt_tokens": p, "completion_tokens": c, "total_tokens": p + c}

    async def stream(self, messages, max_tokens=1024, temperature=0.7, **kwargs) -> AsyncGenerator[str, None]:
        async with self.client.stream("POST", "/api/chat", json=await self._chat(messages, max_tokens, temperature, stream=True)) as r:
            r.raise_for_status()
            async for line in r.aiter_lines():
                if line:
                    piece = json.loads(line).get("message", {}).get("content")
                    if piece:
                        yield piece

    async def structured_output(self, messages, schema: type[T], max_tokens=2048, **kwargs) -> T:
        content, _ = await self.generate(messages, max_tokens=max_tokens, temperature=0.0, format=schema.model_json_schema())
        return schema.model_validate_json(content)

    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        r = await self.client.post("/api/embed", json={"model": settings.ollama_embed_model, "input": texts})
        r.raise_for_status()
        return r.json()["embeddings"]
