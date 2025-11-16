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

### Pipeline CSV -> SQLite
1. Lee el archivo CSV (usa `data/vambe_clients.csv` como plantilla).
2. Limpia y normaliza los datos (booleanos, fechas, transcripts).
3. Invoca un placeholder LLM (`services.llm.llm_classify`) para obtener sentimiento, urgencia, etc.
4. Inserta/actualiza clientes en SQLite y almacena la clasificacion en la tabla `classifications`.

## Tests

```bash
pytest
```

## Deploy en Vercel

- Archivo `vercel.json` ya configurado para usar `@vercel/python` con FastAPI.
- Asigna las variables `GOOGLE_API_KEY`, `APP_SECRET` y `FRONTEND_ORIGIN` desde la UI de Vercel (los valores se inyectan automáticamente en tiempo de ejecución).
