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
- `DATABASE_URL`: cadena completa de Postgres (por ejemplo `postgresql+psycopg://user:pass@host/db`). Si se omite, el backend crea `data/vambe.db` con SQLite para desarrollo local.

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

### Pipeline CSV -> Base de datos
1. Lee el archivo CSV (usa `data/vambe_clients.csv` como plantilla).
2. Limpia y normaliza los datos (booleanos, fechas, transcripts).
3. Invoca el LLM (`services.llm_classifier`) para obtener sentimiento, urgencia, origen, automatización, dolores, riesgos, fit score y probabilidad de cierre.
4. Inserta/actualiza clientes en la base de datos configurada (SQLite local o Postgres gestionado) y almacena la clasificacion en la tabla `classifications`.

### Postgres en Vercel
Como Vercel no puede escribir archivos SQLite, define `DATABASE_URL` apuntando a un Postgres gestionado (Neon, Supabase, Railway). Al iniciar la función serverless, `Base.metadata.create_all` generará las tablas automáticamente. Para poblar datos tras el despliegue, vuelve a ejecutar `/api/ingest/csv` o tu pipeline de clasificación.

## Tests

```bash
pytest
```
