from __future__ import annotations

import re

EMAIL_PATTERN = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)
SECRET_PATTERN = re.compile(r"\b(?:sk|pk|rk|or)-[A-Za-z0-9_-]{8,}\b")
KEY_VALUE_SECRET_PATTERN = re.compile(
    r"\b(?:token|secret|password|api[_-]?key)\s*[:=]\s*[A-Za-z0-9._-]{8,}\b",
    re.IGNORECASE,
)


def redact_text(value: str) -> str:
    redacted = EMAIL_PATTERN.sub("[redacted-email]", value)
    redacted = SECRET_PATTERN.sub("[redacted-secret]", redacted)
    return KEY_VALUE_SECRET_PATTERN.sub("[redacted-secret]", redacted)
