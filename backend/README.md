# Vambe Backend

Proyecto FastAPI disenado para funcionar dentro del monorepo Vambe.

## Comandos rapidos

```bash
pip install -e .[dev]
api-dev  # levanta uvicorn en localhost:8000
```

## Variables de entorno

- `APP_SECRET`: usado para firmar o validar metadatos.
- `GOOGLE_API_KEY`: clave para llamar al modelo Gemini y generar las clasificaciones automáticas.
- `FRONTEND_ORIGIN`: dominio permitido para CORS (por defecto `http://localhost:5173`).

## API principal

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| POST | `/api/ingest/csv` | Ingresa un archivo CSV (por ejemplo `data/vambe_clients.csv`) y dispara el pipeline de clasificacion. |
| POST | `/api/classify/{client_id}` | Recalcula la clasificacion para un cliente especifico. |
| POST | `/api/classify/batch` | Recibe `{ "client_ids": [1,2,3] }` y procesa todos los registros. |
| GET | `/api/clients` | Lista clientes normalizados y su clasificacion. |
| GET | `/api/clients/{id}` | Devuelve un cliente con su clasificacion ligada. |
| GET | `/api/metrics/overview` | KPIs generales (clientes, oportunidades abiertas, etc.). |
| GET | `/api/metrics/funnel` | Conteo por etapas (discovery, evaluation, negotiation, closed). |
| GET | `/api/metrics/conversions` | Serie mensual de conversiones (feed para las tarjetas KPI y timeline). |
| GET | `/api/metrics/pains` | Catálogo de pains históricos (se usa para contextualizar al LLM). |
| GET | `/api/metrics/pains/distribution` | Conteo por dolor para el gráfico horizontal. |
| GET | `/api/metrics/origins` | Distribución de orígenes reportados por el LLM. |
| GET | `/api/metrics/seller-conversion` | Ranking de vendedores (cerrados/total y tasa). |
| GET | `/api/metrics/sentiment-conversion` | Comparativa de sentiment vs casos cerrados/no cerrados. |
| GET | `/api/metrics/automatization-outcomes` | Cruce entre automatización requerida y estado del caso. |

### Pipeline CSV -> SQLite
1. Lee el archivo CSV (usa `data/vambe_clients.csv` como plantilla).
2. Limpia y normaliza los datos (booleanos, fechas, transcripts).
3. Invoca el LLM (`services.llm_classifier`) para obtener sentimiento, urgencia, origen, automatización, dolores, riesgos, fit score y probabilidad de cierre.
4. Inserta/actualiza clientes en SQLite y almacena la clasificacion en la tabla `classifications`.

## Tests

```bash
pytest
```