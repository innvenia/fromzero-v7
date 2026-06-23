from __future__ import annotations

from .schemas import AiBudget, AiModel, BudgetDecision


def _budget_matches(
    *,
    tenant_id: str,
    user_id: str | None,
    feature_key: str | None,
    model: AiModel,
    budget: AiBudget,
) -> bool:
    if not budget.is_active or budget.currency != model.currency:
        return False
    if budget.tenant_id is not None and budget.tenant_id != tenant_id:
        return False
    if budget.user_id is not None and budget.user_id != user_id:
        return False
    if budget.feature_key is not None and budget.feature_key != feature_key:
        return False
    if budget.provider is not None and budget.provider != model.provider:
        return False
    if budget.ai_model_id is not None and budget.ai_model_id != model.id:
        return False

    match budget.scope:
        case "global":
            return True
        case "tenant":
            return budget.tenant_id == tenant_id
        case "provider":
            return budget.provider == model.provider
        case "model":
            return budget.ai_model_id == model.id
        case "user":
            return budget.user_id == user_id
        case "feature":
            return budget.feature_key == feature_key


def evaluate_budgets(
    *,
    tenant_id: str,
    user_id: str | None,
    feature_key: str | None,
    model: AiModel,
    estimated_cost: float,
    budgets: list[AiBudget],
) -> BudgetDecision:
    warnings: list[str] = []
    matched_budget_ids: list[str] = []

    for budget in budgets:
        if not _budget_matches(
            tenant_id=tenant_id,
            user_id=user_id,
            feature_key=feature_key,
            model=model,
            budget=budget,
        ):
            continue

        matched_budget_ids.append(budget.id)
        if budget.spend_to_date + estimated_cost <= budget.max_spend:
            continue
        if budget.on_exceed == "block":
            return BudgetDecision(allowed=False, matched_budget_ids=matched_budget_ids)
        warnings.append("AI budget threshold would be exceeded")

    return BudgetDecision(allowed=True, warnings=warnings, matched_budget_ids=matched_budget_ids)
