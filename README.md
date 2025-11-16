# Categorizacion Automatica y Visualizacion de Metricas de Clientes

Monorepo que unifica un backend de clasificacion basado en FastAPI + SQLite y un frontend en React/Vite orientado a dashboards con KPIs en tiempo real. El objetivo es ingestarlos registros de clientes, clasificarlos automaticamente mediante un pipeline LLM y exponer visualizaciones que permitan priorizar oportunidades comerciales.

## Stack Tecnico

- **Frontend**: React 18, Vite, TypeScript, Material UI, TailwindCSS, Recharts, React Router, React Query, Zustand.
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic, pytest.
- **Infraestructura**: Vercel (frontend static hosting + backend serverless Python), CORS configurable via `FRONTEND_ORIGIN`.

## Instalacion

1. Clonar el repositorio y copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Completa `GOOGLE_API_KEY`, `APP_SECRET` y `FRONTEND_ORIGIN` (por defecto `http://localhost:5173`).

2. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -e .[dev]
   api-dev  # Ejecuta uvicorn con autoreload
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev  # Puerto 5173
   ```

## Ejemplo de uso (Clasificacion via curl)

```bash
curl -X POST http://localhost:8000/api/classify/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $APP_SECRET" \
  | jq
```

Respuesta esperada:

```json
{
  "client_id": 1,
  "status": "classified"
}
```

## Dashboard

El frontend expone dos vistas principales:

- **Metrics**: tarjetas KPI (conversion rate, sentimiento promedio, probabilidad media de cierre), grafico de objeciones, heatmap de urgencia vs presupuesto y tendencias de conversion.
- **Clients**: DataGrid con filtros (fecha, seller, segmento), drawer lateral con detalle de clasificacion (sentiment, urgency, fit score, probabilidad de cierre) y transcript.

Estas vistas consumen los endpoints `/api/metrics/*` y `/api/clients` a traves de React Query, actualizando los componentes creados (`KpiCards`, `ObjectionsChart`, `UrgencyBudgetHeatmap`, `CompetitorsWinRate`, `ConversionTimeline`).

## Deploy en Vercel

- **Frontend (`/frontend`)**: `vercel.json` ejecuta `npm run build` y publica `dist/`. Define `VITE_API_BASE_URL` apuntando al backend.
- **Backend (`/backend`)**: `vercel.json` usa `@vercel/python` para levantar FastAPI sobre `api/main.py`. Configura las variables `GOOGLE_API_KEY`, `APP_SECRET` y `FRONTEND_ORIGIN`.
- **CORS**: la API solo acepta el origen definido en `FRONTEND_ORIGIN`, por lo que en produccion debe coincidir con la URL del frontend desplegado.

## Proximas Mejoras

1. **Busqueda semantica** en transcripts para encontrar conversaciones similares y alimentar el panel con insights relevantes.
2. **Exportacion** de clientes y metricas a CSV/Sheets con filtros aplicados.
3. **Active learning** que permita re-entrenar el clasificador a partir de feedback de los sellers (aceptar/rechazar etiquetas).

## Pruebas

```bash
cd backend
pytest
```
