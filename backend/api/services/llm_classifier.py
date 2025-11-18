from __future__ import annotations

import json
import time

from .genai_client import client

from ..schemas.classification import ClassificationBase
from ..models.database import SessionLocal
from .metrics import list_pains

SYSTEM_PROMPT = (
    """Eres un analista experto en ventas B2B. Recibirás el transcrito de una reunión comercial y deberás evaluar al cliente usando criterios cuantitativos y cualitativos. Tu salida debe ser un JSON estricto y válido. Si no hay información suficiente en el transcrito, devuelve null o [] según corresponda en los campos donde se permita.

        Tus evaluaciones deben ser consistentes y seguir estas reglas:
        - Usa escalas y categorías definidas.
        - No inventes información no presente en el texto.
        - Sé conservador al asignar probabilidades de "fit_score y "close_probability".
        - Sé crítico al determinar el "sentiment", el "origin" del lead y si requiere "automatization"."""
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
                "use_case": "Venta productos" | "Servicios" | "Tecnología" | "Alimentos" | "Salud" | "Finanzas, administración y asesorías"
                "pains": [strings] | [],
                "risks": [strings] | ,
                "origin": "Eventos" | "Conocidos" | "Web" | "Contacto directo" | null
                "automatization": boolean,
                "fit_score": float (0 a 1),
                "close_probability": float (0 a 1),
                "summary": string
                }

                Donde:
                - "fit_score" evalúa cuán bien Vambe AI resuelve el problema del cliente.
                - "close_probability" evalúa la probabilidad de cierre considerando todas las señales.
                - "origin" representa la fuente de como el cliente conoció a Vambe.
                - "automatization" debe ser true cuando el cliente menciona explicitamente que requiere automatizar flujos de trabajo, y false en caso contrario.
                - "summary" debe ser breve, no más de 80 caracteres
                - "pains" representa categorías de dolores encontrados. Debes elegir entre las categorías [{LISTA_DOLORES_AQUI}] y solo si quedan dolores sin listar crear una nueva categoría de máximo 4 palabras."""
)

MODEL_NAME = "gemini-2.5-flash-lite"


def build_prompt(transcript: str) -> str:
    db = SessionLocal()
    try:
        pains_data = list_pains(db)
    finally:
        db.close()

    pains_list = getattr(pains_data, "pains", []) or []
    pains_text = ", ".join(pains_list) if pains_list else "Sin pains registrados"

    prompt = USER_PROMPT.replace("{TRANSCRITO_AQUI}", transcript)
    prompt = prompt.replace("{LISTA_DOLORES_AQUI}", pains_text)
    return prompt


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
