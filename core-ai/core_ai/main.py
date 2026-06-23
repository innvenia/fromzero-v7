from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from fastapi import FastAPI, Header, HTTPException, status

from .budgets import evaluate_budgets
from .providers import AiProvider, MockProvider
from .schemas import (
    AiBudget,
    AiModel,
    AiRequest,
    AiResponse,
    assert_request_within_model_limits,
    estimate_cost,
)


def _resolve_model(models: Sequence[AiModel], model_id: str | None) -> AiModel:
    if model_id is not None:
        for model in models:
            if model.id == model_id or model.model_id == model_id:
                return model
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI model not found")

    for model in models:
        if model.is_active and model.deprecated_at is None:
            return model

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI model not found")


def _build_usage_log(
    *,
    request: AiRequest,
    model: AiModel,
    input_tokens: int,
    output_tokens: int,
    estimated_cost: float,
    warnings: list[str],
    provider_request_id: str | None,
) -> dict[str, Any]:
    return {
        "tenant_id": request.tenant_id,
        "user_id": request.user_id,
        "feature_key": request.feature_key,
        "provider": model.provider,
        "model_record_id": model.id,
        "model_id": model.model_id,
        "tokens_input": input_tokens,
        "tokens_output": output_tokens,
        "pricing_unit": model.pricing_unit,
        "currency": model.currency,
        "estimated_cost_usd": estimated_cost,
        "redaction_applied": request.prompt != request.redacted_prompt,
        "budget_warnings": warnings,
        "provider_request_id": provider_request_id,
    }


def create_app(
    *,
    models: Sequence[AiModel] | None = None,
    budgets: Sequence[AiBudget] | None = None,
    provider: AiProvider | None = None,
    internal_secret: str = "test-internal-secret",
) -> FastAPI:
    app = FastAPI(title="FromZero Core AI", version="7.4.0")
    configured_models = list(models or [])
    configured_budgets = list(budgets or [])
    configured_provider = provider or MockProvider(content="Core AI provider is not configured")

    @app.get("/v1/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/v1/invoke", response_model=AiResponse)
    async def invoke_ai(request: AiRequest, authorization: str = Header(default="")) -> AiResponse:
        if authorization != f"Bearer {internal_secret}":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Core AI request")

        model = _resolve_model(configured_models, request.model_id)
        if not model.is_active or model.deprecated_at is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="AI model is inactive or deprecated")

        try:
            assert_request_within_model_limits(model, request)
        except ValueError as error:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error

        estimated_cost = estimate_cost(model, request.input_tokens, request.requested_output_tokens)
        decision = evaluate_budgets(
            tenant_id=request.tenant_id,
            user_id=request.user_id,
            feature_key=request.feature_key,
            model=model,
            estimated_cost=estimated_cost,
            budgets=configured_budgets,
        )

        if not decision.allowed:
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="AI budget would be exceeded")

        result = await configured_provider.invoke(model=model, request=request)

        return AiResponse(
            content=result.content,
            usage_log=_build_usage_log(
                request=request,
                model=model,
                input_tokens=result.input_tokens,
                output_tokens=result.output_tokens,
                estimated_cost=estimated_cost,
                warnings=decision.warnings,
                provider_request_id=result.provider_request_id,
            ),
        )

    return app


app = create_app()
