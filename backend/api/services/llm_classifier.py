from __future__ import annotations

import json
import time

from .genai_client import client

from ..schemas.classification import ClassificationBase

SYSTEM_PROMPT = (
    """Eres un analista experto en ventas B2B. Recibirás el transcrito de una reunión comercial y deberás evaluar al cliente usando criterios cuantitativos y cualitativos. Tu salida debe ser un JSON estricto y válido. Si no hay información suficiente en el transcrito, devuelve null o [] según corresponda.

        Tus evaluaciones deben ser consistentes y seguir estas reglas:
        - Usa escalas y categorías definidas.
        - No inventes información no presente en el texto.
        - Sé conservador al asignar probabilidades."""
)

USER_PROMPT = (
    """Analiza el siguiente transcrito y genera una clasificación completa.

                TRANSCRITO:
                ""
                {TRANSCRITO_AQUI}
                ""

                Devuelve exclusivamente un JSON con el siguiente esquema:

                {
                "sentiment": integer (-2 a 2),
                "urgency": integer (0 a 3),
                "budget_tier": "Low" | "Medium" | "High" | null,
                "buyer_role": "Decisor" | "Influenciador" | "Usuario" | null,
                "use_case": string | null,
                "pains": [strings],
                "objections": [strings],
                "competitors": [strings],
                "risks": [strings],
                "next_step_clarity": integer (0 a 3),
                "fit_score": float (0 a 1),
                "close_probability": float (0 a 1),
                "summary": string
                }

                Donde:
                - "fit_score" evalúa cuán bien Vambe AI resuelve el problema del cliente.
                - "close_probability" evalúa la probabilidad de cierre considerando todas las señales.
                - "next_step_clarity" indica si quedó acción definida."""
)

MODEL_NAME = "gemini-2.5-flash-lite"


def build_prompt(transcript: str) -> str:
    parts = USER_PROMPT.split("{TRANSCRITO_AQUI}")
    return f"{parts[0]}{transcript}{parts[1]}"


def _extract_text(response) -> str:
    if text := getattr(response, "text", None):
        return text
    candidates = getattr(response, "candidates", None) or []
    if candidates:
        return getattr(candidates[0], "content", "") or ""
    return ""


def _is_rate_limit_error(exc: Exception) -> bool:
    text = str(exc)
    code = getattr(exc, "code", None)
    name = exc.__class__.__name__
    indicators = (
        "ResourceExhausted",
        "TooManyRequests",
        "RESOURCE_EXHAUSTED",
        "TOO_MANY_REQUESTS",
    )
    return any(indicator in part for part in (text, str(code), name) for indicator in indicators)


def call_api(transcript: str):
    prompt = f"{SYSTEM_PROMPT}\n\n{build_prompt(transcript)}"
    attempts = 0
    max_attempts = 3
    wait_seconds = 60
    while True:
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents= prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_json_schema": ClassificationBase.model_json_schema(),
                },
            )
            raw = _extract_text(response).strip()
            if not raw:
                raise RuntimeError("La respuesta de Gemini no contenía texto")
            return json.loads(raw)
        except Exception as exc:
            if not _is_rate_limit_error(exc):
                raise
            attempts += 1
            if attempts >= max_attempts:
                raise RuntimeError("Se alcanzó el límite de 15 solicitudes por minuto de Gemini") from exc
            print(f"Se alcanzó el límite ({attempts}/{max_attempts}); esperando {wait_seconds}s...")
            time.sleep(wait_seconds)
