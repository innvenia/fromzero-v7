from __future__ import annotations

from typing import Protocol

import httpx

from .schemas import AiModel, AiRequest, ProviderResult


class AiProvider(Protocol):
    async def invoke(self, *, model: AiModel, request: AiRequest) -> ProviderResult:
        ...


class MockProvider:
    def __init__(self, *, content: str, provider_request_id: str = "mock-ai-provider") -> None:
        self.content = content
        self.provider_request_id = provider_request_id

    async def invoke(self, *, model: AiModel, request: AiRequest) -> ProviderResult:
        return ProviderResult(
            provider="mock",
            provider_request_id=self.provider_request_id,
            content=self.content,
            input_tokens=request.input_tokens,
            output_tokens=request.requested_output_tokens,
        )


class OpenRouterProvider:
    def __init__(self, *, api_key: str, client: httpx.AsyncClient | None = None) -> None:
        self.api_key = api_key
        self.client = client

    async def invoke(self, *, model: AiModel, request: AiRequest) -> ProviderResult:
        if not self.api_key:
            raise ValueError("OpenRouter API key is required")

        endpoint = str(model.endpoint_url or "https://openrouter.ai/api/v1/chat/completions")
        payload = {
            "model": model.model_id,
            "messages": [{"role": "user", "content": request.redacted_prompt}],
            "max_tokens": request.requested_output_tokens,
            **model.default_parameters,
        }
        headers = {
            "authorization": f"Bearer {self.api_key}",
            "content-type": "application/json",
        }

        if self.client is not None:
            response = await self.client.post(endpoint, headers=headers, json=payload, timeout=model.request_timeout_seconds)
        else:
            async with httpx.AsyncClient() as client:
                response = await client.post(endpoint, headers=headers, json=payload, timeout=model.request_timeout_seconds)

        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})

        return ProviderResult(
            provider="openrouter",
            provider_request_id=data.get("id"),
            content=content,
            input_tokens=usage.get("prompt_tokens", request.input_tokens),
            output_tokens=usage.get("completion_tokens", request.requested_output_tokens),
        )
