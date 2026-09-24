"""
AI Provider Abstraction Layer
==============================
All LLM calls go through this interface. Switch providers via LLM_PROVIDER env var.
The frontend NEVER calls any AI provider directly.
"""
from __future__ import annotations

import time
from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator, TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseAIProvider(ABC):
    """Abstract interface all providers must implement."""

    @abstractmethod
    async def generate(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1024,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> tuple[str, dict[str, int]]:
        """
        Returns (content, usage_dict).
        usage_dict keys: prompt_tokens, completion_tokens, total_tokens
        """

    @abstractmethod
    async def stream(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1024,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> AsyncGenerator[str, None]:
        """Yields text delta chunks for streaming."""

    @abstractmethod
    async def structured_output(
        self,
        messages: list[dict[str, str]],
        schema: type[T],
        max_tokens: int = 2048,
        **kwargs: Any,
    ) -> T:
        """Returns a Pydantic model parsed from the LLM JSON response."""

    @abstractmethod
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Returns embedding vectors for each text."""

    @property
    @abstractmethod
    def provider_name(self) -> str: ...

    @property
    @abstractmethod
    def default_model(self) -> str: ...
