from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, computed_field, field_validator, model_validator

from .redaction import redact_text

Provider = Literal["openrouter", "openai", "anthropic", "google", "azure", "ollama", "custom"]
PricingUnit = Literal["per_1k", "per_1m"]
Modality = Literal["text", "image", "audio", "video"]
BudgetScope = Literal["global", "tenant", "provider", "model", "user", "feature"]
BudgetPeriod = Literal["day", "month", "total"]
BudgetAction = Literal["block", "warn"]


class AiModel(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: str
    name: str = Field(min_length=1, max_length=100)
    provider: Provider
    model_id: str = Field(min_length=1, max_length=160)
    endpoint_url: HttpUrl | None = None
    default_parameters: dict[str, Any] = Field(default_factory=dict)
    pricing_unit: PricingUnit
    currency: str = Field(min_length=3, max_length=3)
    cost_input: float = Field(ge=0)
    cost_output: float = Field(ge=0)
    context_window: int = Field(gt=0)
    max_input_tokens: int | None = Field(default=None, gt=0)
    max_tokens: int | None = Field(default=None, gt=0)
    max_cost_per_request: float | None = Field(default=None, ge=0)
    request_timeout_seconds: int | None = Field(default=None, gt=0)
    supports_streaming: bool = False
    input_modalities: list[Modality] = Field(default_factory=lambda: ["text"])
    deprecated_at: str | None = None
    fallback_model_id: str | None = None
    is_active: bool = True

    @field_validator("currency")
    @classmethod
    def uppercase_currency(cls, value: str) -> str:
        return value.upper()

    @model_validator(mode="after")
    def validate_token_limits(self) -> "AiModel":
        if self.max_input_tokens is not None and self.max_input_tokens > self.context_window:
            raise ValueError("max_input_tokens cannot exceed context_window")
        if self.max_tokens is not None and self.max_tokens > self.context_window:
            raise ValueError("max_tokens cannot exceed context_window")
        return self


class AiBudget(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: str
    tenant_id: str | None = None
    user_id: str | None = None
    feature_key: str | None = Field(default=None, max_length=120)
    scope: BudgetScope
    provider: Provider | None = None
    ai_model_id: str | None = None
    period: BudgetPeriod
    max_spend: float = Field(ge=0)
    spend_to_date: float = Field(ge=0)
    currency: str = Field(min_length=3, max_length=3)
    on_exceed: BudgetAction = "block"
    is_active: bool = True

    @field_validator("currency")
    @classmethod
    def uppercase_currency(cls, value: str) -> str:
        return value.upper()

    @model_validator(mode="after")
    def validate_scope(self) -> "AiBudget":
        required_fields = {
            "tenant": self.tenant_id,
            "provider": self.provider,
            "model": self.ai_model_id,
            "user": self.user_id,
            "feature": self.feature_key,
        }
        required_value = required_fields.get(self.scope)
        if self.scope != "global" and required_value is None:
            raise ValueError(f"{self.scope} AI budgets require their matching scope field")
        return self


class AiRequest(BaseModel):
    tenant_id: str
    user_id: str | None = None
    feature_key: str | None = Field(default=None, max_length=120)
    prompt: str = Field(min_length=1)
    input_tokens: int = Field(gt=0)
    requested_output_tokens: int = Field(gt=0)
    modality: Modality = "text"
    model_id: str | None = None

    @computed_field
    @property
    def redacted_prompt(self) -> str:
        return redact_text(self.prompt)


class ProviderResult(BaseModel):
    provider: str
    provider_request_id: str | None
    content: str
    input_tokens: int
    output_tokens: int


class AiResponse(BaseModel):
    content: str
    usage_log: dict[str, Any]


class BudgetDecision(BaseModel):
    allowed: bool
    warnings: list[str] = Field(default_factory=list)
    matched_budget_ids: list[str] = Field(default_factory=list)


def estimate_cost(model: AiModel, input_tokens: int, output_tokens: int) -> float:
    divisor = 1_000 if model.pricing_unit == "per_1k" else 1_000_000
    return round(
        (input_tokens / divisor * model.cost_input)
        + (output_tokens / divisor * model.cost_output),
        12,
    )


def assert_request_within_model_limits(model: AiModel, request: AiRequest) -> None:
    if request.input_tokens > model.context_window or request.input_tokens + request.requested_output_tokens > model.context_window:
        raise ValueError("AI input exceeds model limit")
    if model.max_input_tokens is not None and request.input_tokens > model.max_input_tokens:
        raise ValueError("AI input exceeds model limit")
    if model.max_tokens is not None and request.requested_output_tokens > model.max_tokens:
        raise ValueError("AI output exceeds model limit")
    if request.modality not in model.input_modalities:
        raise ValueError("AI modality is not supported")
    estimated = estimate_cost(model, request.input_tokens, request.requested_output_tokens)
    if model.max_cost_per_request is not None and estimated > model.max_cost_per_request:
        raise ValueError("AI request exceeds model cost limit")
