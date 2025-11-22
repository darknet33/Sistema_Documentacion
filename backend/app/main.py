from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.modules import router as modules_router
from fastapi.staticfiles import StaticFiles
import os
import time
from sqlalchemy.exc import OperationalError
from fastapi.responses import FileResponse

# Crea la aplicación FastAPI
app = FastAPI(
    title="API Sistema Control Documentos FastAPI",
    description="Proyecto base con estructura modular.",
    version="1.0.0"
)

# Configuración de CORS
origins = [
    "http://localhost:5173",  # Frontend en Vite
    "http://127.0.0.1:5173"   # Alternativa (a veces el navegador usa 127.0.0.1 en lugar de localhost)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],            # Métodos permitidos (GET, POST, PUT, DELETE...)
    allow_headers=["*"],            # Headers permitidos
)

# Ruta absoluta a la carpeta 'static' dentro de 'app'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # /path/to/backend/app
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Montar la carpeta estática
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.on_event("startup")
def on_startup():
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


# Incluir todos los routers automáticamente
app.include_router(modules_router)


# Sirve index.html desde /
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="frontend")
