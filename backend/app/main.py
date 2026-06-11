from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.modules import router as modules_router
from app.core.config import settings
import time
from sqlalchemy.exc import OperationalError

app = FastAPI(
    title="API Sistema Control Documentos FastAPI",
    description="Proyecto base con estructura modular.",
    version="1.0.0"
)

# CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
