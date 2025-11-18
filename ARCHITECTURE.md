# Arquitectura y decisiones clave

## Visión general
El proyecto es un monorepo con dos paquetes principales:

- **backend/**: API REST en FastAPI para ingestión de clientes, clasificación vía LLM y exposición de métricas agregadas.
- **frontend/**: SPA en React/Vite que consume la API y presenta dashboards analíticos y herramientas operativas para el equipo comercial.

La comunicación se hace mediante JSON sobre HTTP. React Query maneja cache y estados de petición, mientras que FastAPI y SQLAlchemy exponen los datos persistidos en SQLite (local) o Postgres (en despliegue).

## Backend
### Capas
1. **Modelos (`backend/api/models`)**: tablas `client`, `transcript` y `classification`. Los modelos contienen campos normalizados (sentiment, origin, automatization, etc.).
2. **Servicios (`backend/api/services`)**:
   - `pipeline`: ingesta CSV y alta de clientes/transcripts.
   - `classify`: coordina llamadas a `llm_classifier` y persiste resultados.
   - `metrics`: agrega datos para los widgets del dashboard (usos, pains, seller rankings, automatización, etc.).
3. **Rutas (`backend/api/routes`)**: exponen endpoints `clients`, `metrics`, `classify`, `ingest`. Cada ruta importa un servicio y trabaja con esquemas Pydantic.

### Integración LLM
`llm_classifier.py` construye un prompt contextualizado (histórico de pains y objections) y valida la respuesta usando `ClassificationBase`. Se implementaron reintentos y detección de rate limiting para Gemini.

### Decisiones clave
- **SQLAlchemy** permite trabajar con SQLite para DX local y con Postgres gestionado en Vercel (Neon/Supabase) sin cambios drásticos en el ORM.
- **Servicios especializados** facilitan pruebas unitarias y evitan lógica en controladores.
- **Endp. de métricas específicos** (`/metrics/origins`, `/metrics/automatization-outcomes`, etc.) reducen la carga del frontend y estandarizan respuestas.

## Frontend
### Estado y datos
- **React Query** centraliza fetch/caching y habilita revalidaciones tras ingestiones o acciones del usuario.
- **Zustand (`useFilterStore`)** coordina filtros globales entre tabla y componentes.

### Layout y estilos
- Base en MUI con theme personalizado (paleta, tipografía). Componentes clave adoptan una estética común: tarjetas con sombras suaves, tipografía jerárquica (caption → h3), y colores secundarios para resaltar métricas.
- `DashboardLayout` utiliza CSS Grid para distribuir widgets según breakpoints. Slots adicionales se introdujeron para alojar nuevos gráficos.
- La tabla de clientes (`ClientsTable`) se envolvió en un contenedor con radios y sombras para mantener consistencia visual.

### Componentes destacados
- **KpiCards**: rediseñadas con iconografía, valores principales y comparaciones alineadas a la derecha.
- **Distribuciones** (UseCase, Pain, Origin): cada una ofrece filtros o rankings personalizados, manteniendo la misma narrativa visual.
- **SellerConversionList**: jerarquiza vendedores (Top 1-3) con avatares generados dinámicamente.
- **ClientDetailsDrawer**: replica las tarjetas con secciones separadas, campos nuevos (origen, automatización, dolores, riesgos) y tipografía uniforme.

## Flujo de datos
1. Usuario ingresa CSV → `pipeline.ingest` crea clientes/transcripts → se dispara `classify_transcript`.
2. `llm_classifier` obtiene la respuesta del LLM y persiste la clasificación.
3. Widgets y tablas consultan `/metrics/*` o `/clients` con filtros (React Query) y muestran resultados en tiempo real.

## Buenas prácticas adoptadas
- **Pydantic** asegura contratos estrictos entre backend y frontend.
- **Tipado TypeScript** actualizado (p. ej. `Classification`) evita errores de runtime.
- **Componentes reutilizables** (`InfoRow`, stacks, chips) conservan consistencia visual.
- **Documentación**: README principal, README por paquete y este archivo guían la arquitectura.
