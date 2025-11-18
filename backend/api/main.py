from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models.database import init_db
from .routes import classify, clients, dashboard, health, ingest, metrics, transcripts

from .settings import settings

init_db()

app = FastAPI(title="Vambe API", version="0.1.0", description="FastAPI + SQLite backend for the Vambe monorepo.")

allowed_origins = ["*"]
if settings.frontend_origin:
    allowed_origins = [settings.frontend_origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(health.router)

api_routers = (dashboard.router, ingest.router, classify.router, clients.router, metrics.router, transcripts.router)
for router in api_routers:
    app.include_router(router, prefix="/api")


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
    return {"message": "Vambe backend is running"}


def run() -> None:
    """Local entrypoint used by the pip script."""
    import uvicorn

    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    run()
