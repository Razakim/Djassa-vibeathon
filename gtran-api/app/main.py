from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import router
from app.store import get_store
from app.websockets.realtime import router as ws_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    get_store()
    yield


app = FastAPI(
    title="Gtran API",
    description="API de gestion transport & logistique — Afrique de l'Ouest",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(ws_router)


@app.get("/")
def root():
    return {"status": "ok", "service": "gtran-api", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "gtran-api"}
