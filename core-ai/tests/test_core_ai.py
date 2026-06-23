from fastapi.testclient import TestClient

from core_ai.budgets import evaluate_budgets
from core_ai.main import create_app
from core_ai.providers import MockProvider
from core_ai.redaction import redact_text
from core_ai.schemas import AiBudget, AiModel, AiRequest, estimate_cost


TENANT_ID = "22222222-2222-4222-8222-222222222222"
USER_ID = "11111111-1111-4111-8111-111111111111"
MODEL_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"


def build_model() -> AiModel:
    return AiModel(
        id=MODEL_ID,
        name="Google Gemma 4 26B A4B Free",
        provider="openrouter",
        model_id="google/gemma-4-26b-a4b-it:free",
        endpoint_url="https://openrouter.ai/api/v1/chat/completions",
        pricing_unit="per_1m",
        currency="USD",
        cost_input=0,
        cost_output=0,
        context_window=262144,
        max_input_tokens=200000,
        max_tokens=4096,
        max_cost_per_request=0.25,
        request_timeout_seconds=30,
        supports_streaming=False,
        input_modalities=["text", "image", "video"],
        is_active=True,
    )


def test_model_cost_and_request_validation() -> None:
    model = build_model()
    request = AiRequest(
        tenant_id=TENANT_ID,
        user_id=USER_ID,
        feature_key="task.summarize",
        prompt="Summarize this record",
        input_tokens=1000,
        requested_output_tokens=500,
        modality="text",
    )

    assert estimate_cost(model, request.input_tokens, request.requested_output_tokens) == 0
    assert request.redacted_prompt == "Summarize this record"


def test_redaction_removes_email_and_secret_like_values() -> None:
    redacted = redact_text("Email owner@example.com with token sk-test-secret-value")

    assert "owner@example.com" not in redacted
    assert "sk-test-secret-value" not in redacted
    assert "[redacted-email]" in redacted
    assert "[redacted-secret]" in redacted


def test_budget_blocks_when_estimated_cost_exceeds_limit() -> None:
    budget = AiBudget(
        id="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        tenant_id=TENANT_ID,
        user_id=USER_ID,
        feature_key="task.summarize",
        scope="user",
        provider="openrouter",
        ai_model_id=MODEL_ID,
        period="month",
        max_spend=0.01,
        spend_to_date=0.009,
        currency="USD",
        on_exceed="block",
        is_active=True,
    )

    decision = evaluate_budgets(
        tenant_id=TENANT_ID,
        user_id=USER_ID,
        feature_key="task.summarize",
        model=build_model(),
        estimated_cost=0.002,
        budgets=[budget],
    )

    assert decision.allowed is False
    assert decision.matched_budget_ids == [budget.id]


def test_fastapi_invoke_endpoint_uses_mock_provider_and_omits_prompt_from_usage_log() -> None:
    app = create_app(
        models=[build_model()],
        budgets=[],
        provider=MockProvider(content="Mocked answer", provider_request_id="mock_1"),
    )
    client = TestClient(app)

    response = client.post(
        "/v1/invoke",
        json={
            "tenant_id": TENANT_ID,
            "user_id": USER_ID,
            "feature_key": "task.summarize",
            "prompt": "Summarize admin@example.com",
            "input_tokens": 12,
            "requested_output_tokens": 6,
            "modality": "text",
            "model_id": MODEL_ID,
        },
        headers={"authorization": "Bearer test-internal-secret"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["content"] == "Mocked answer"
    assert payload["usage_log"]["model_id"] == "google/gemma-4-26b-a4b-it:free"
    assert "prompt" not in payload["usage_log"]
    assert "admin@example.com" not in str(payload)
