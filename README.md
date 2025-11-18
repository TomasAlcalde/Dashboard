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

- **Metrics**: tarjetas KPI, distribución de casos por industria, ranking de vendedores, gráfico de automatización vs estado, distribución de dolores/orígenes y timeline de conversión. Se alimentan de React Query.
- **Clients**: DataGrid con filtros (fecha, seller) y chips de estado. Al seleccionar un registro se abre un drawer lateral con la clasificación completa (sentiment, urgency, fit score, close probability, origen, automatización, riesgos, dolores) y el transcript asociado.

Estas vistas consumen los endpoints `/api/metrics/*` y `/api/clients` a traves de React Query, actualizando los componentes creados (`KpiCards`, `MonthlyConversionTrend`, `UseCaseDistribution`, `SellerConversionList`, `PainDistribution`, `AutomatizationOutcomeChart`, `OriginDistributionList`).

## Documentación

- [Arquitectura y decisiones clave](ARCHITECTURE.md)
- `backend/README.md` y `frontend/README.md` profundizan en cada paquete.

## Pruebas

```bash
cd backend
pytest
```
