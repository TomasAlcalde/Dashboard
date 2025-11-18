# Vambe Frontend

SPA en React + Vite que consume la API de Vambe y expone dashboards operativos.

## Requisitos
- Node 18+
- npm 9+

## Inicio rápido
```bash
cd frontend
npm install
npm run dev # http://localhost:5173
```

## Scripts
| Comando           | Descripción                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Arranca Vite en modo desarrollo              |
| `npm run build`   | Genera `dist/` listo para deploy             |
| `npm run preview` | Sirve el build local para verificación       |
| `npm run lint`    | Revisa el código con ESLint                  |

## Variables de entorno
Define en `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```
Este endpoint se usa en todos los hooks de React Query (`fetchClients`, `fetchMetrics`, etc.).

## Estructura
- `src/api`: hooks/funciones para acceder a la API (`clients.ts`).
- `src/components`: piezas reusables (dashboard y clientes).
- `src/pages`: vistas principales (`Metrics`, `Clients`).
- `src/layout`: layout común con Sidebar/Header.

## Estilos
- Material UI como base; se complementa con utilidades de Tailwind para spacing/grid.
- Se aplica un lenguaje visual uniforme: tarjetas con sombras suaves, tipografía jerárquica y colores secundarios para métricas.

## Integración
- React Query maneja el cache y revalidación de datos.
- Zustand (`useFilterStore`) sincroniza filtros entre tabla y widgets.
- El build final (`npm run build`) se despliega en Vercel usando `frontend/vercel.json`.
