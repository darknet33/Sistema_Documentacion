from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.modules import router as modules_router
from app.core.config import settings
import time
from sqlalchemy.exc import OperationalError

app = FastAPI(
    title=settings.APP_NAME,
    description="API del Sistema de Documentación",
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    if settings.DB_ENGINE == "sqlite":
        Base.metadata.create_all(bind=engine)
        print("Base de datos SQLite lista.")
        return

    print("Esperando a que MySQL esté listo...")
    retries = 60
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            print("Base de datos lista.")
            break
        except OperationalError:
            retries -= 1
            print("MySQL no listo, reintentando en 3s...")
            time.sleep(3)
    else:
        raise RuntimeError("No se pudo conectar a MySQL después de varios intentos")


app.include_router(modules_router)
