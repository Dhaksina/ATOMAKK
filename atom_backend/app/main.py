from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_database, close_database
from app.routers import (
    auth,
    products,
    categories,
    industries,
    testimonials,
    quotes,
    contacts,
    certificates,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    yield
    await close_database()


app = FastAPI(
    title="ATOM India Backend API",
    description="Backend API for ATOM India calibration instruments platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(industries.router)
app.include_router(testimonials.router)
app.include_router(quotes.router)
app.include_router(contacts.router)
app.include_router(certificates.router)


@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "ATOM India Backend API", "version": "1.0.0"}
