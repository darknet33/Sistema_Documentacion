from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.modules import router as modules_router
from fastapi.staticfiles import StaticFiles

# Crea la aplicación FastAPI
app = FastAPI(
    title="API Sistema Control Documentos FastAPI",
    description="Proyecto base con estructura modular.",
    version="1.0.0"
)

# Configuración de CORS
origins = [
    "http://localhost:5173",  # Frontend en Vite
    "http://127.0.0.1:5173",   # Alternativa (a veces el navegador usa 127.0.0.1 en lugar de localhost)
    "http://192.168.0.10:5173",
    "http://192.168.1.9:5173"   # Alternativa (a veces el navegador usa 127.0.0.1 en lugar de localhost)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],            # Métodos permitidos (GET, POST, PUT, DELETE...)
    allow_headers=["*"],            # Headers permitidos
)

app.mount("/static", StaticFiles(directory="uploads"), name="static")


# Al iniciar la aplicación, crea las tablas si no existen en 'test.db'
@app.on_event("startup")
def on_startup():
    print("Creando tablas de base de datos si no existen...")
    Base.metadata.create_all(bind=engine)
    print("Base de datos lista.")


# Incluir todos los routers automáticamente
app.include_router(modules_router)

@app.get("/", tags=["Root"])
def read_root():
    """Endpoint de prueba para verificar que la API está funcionando."""
    return {"message": "Servicio de API iniciado. Revisa /docs para la documentación."}
