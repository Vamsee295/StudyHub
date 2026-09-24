import json
import logging
from typing import Any, AsyncGenerator, TypeVar
from groq import AsyncGroq
from pydantic import BaseModel

from app.ai.provider.base import BaseAIProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

class GroqProvider(BaseAIProvider):
    """Implementation of the AI provider using Groq's API."""

    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY must be set to use GroqProvider")
        
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    @property
    def provider_name(self) -> str:
        return "groq"

    @property
    def default_model(self) -> str:
        return settings.GROQ_MODEL or "llama3-70b-8192"

    async def generate(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1024,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> tuple[str, dict[str, int]]:
        
        model = kwargs.get("model", self.default_model)
        
        response = await self.client.chat.completions.create(
            messages=messages,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=False,
            **kwargs,
        )
        
        content = response.choices[0].message.content or ""
        
        # Format usage dict to match our expected schema
        usage_dict = {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            "total_tokens": response.usage.total_tokens if response.usage else 0,
        }
        
        return content, usage_dict

    async def stream(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1024,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        
        model = kwargs.get("model", self.default_model)
        
        stream = await self.client.chat.completions.create(
            messages=messages,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True,
            **kwargs,
        )
        
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def structured_output(
        self,
        messages: list[dict[str, str]],
        schema: type[T],
        max_tokens: int = 2048,
        **kwargs: Any,
    ) -> T:
        
        model = kwargs.get("model", self.default_model)
        
        # Instruct the model to return JSON matching the schema
        schema_json = schema.model_json_schema()
        system_instruction = f"""
        You must return ONLY valid JSON matching this schema. Do not wrap in markdown blocks.
        Schema: {json.dumps(schema_json)}
        """
        
        # Ensure system message exists or inject it
        has_system = any(m.get("role") == "system" for m in messages)
        if has_system:
            messages = [{"role": "system", "content": system_instruction}] + [
                m for m in messages if m.get("role") != "system"
            ]
        else:
            messages = [{"role": "system", "content": system_instruction}] + messages
            
        # Groq supports json_object response format
        response = await self.client.chat.completions.create(
            messages=messages,
            model=model,
            max_tokens=max_tokens,
            temperature=0.0, # Force deterministic for JSON
            response_format={"type": "json_object"},
            stream=False,
            **kwargs,
        )
        
        content = response.choices[0].message.content or "{}"
        
        try:
            return schema.model_validate_json(content)
        except Exception as e:
            logger.error(f"Failed to parse structured output: {e}\nContent: {content}")
            raise ValueError(f"Model failed to generate valid structured data: {e}")

    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        # Currently Groq doesn't offer an embeddings API endpoint in the same way OpenAI does.
        # So we might need to fallback to a different provider or implement a workaround.
        # For now, raise NotImplementedError if used.
        raise NotImplementedError("Groq provider currently does not support native embeddings.")
