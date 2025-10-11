from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.modules.users import router as users_router
from app.modules.auth import router as auth_router
from app.modules.perfiles import router as perfiles_router
from app.modules.cursos import router as cursos_router
from app.modules.catalogo_documentos import router as documentos_router

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

# Al iniciar la aplicación, crea las tablas si no existen en 'test.db'
@app.on_event("startup")
def on_startup():
    print("Creando tablas de base de datos si no existen...")
    Base.metadata.create_all(bind=engine)
    print("Base de datos lista.")


# 1. Conexión de Routers Modulares
app.include_router(users_router.router, prefix="/api/v1")
app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(perfiles_router.router, prefix="/api/v1")
app.include_router(cursos_router.router, prefix="/api/v1")
app.include_router(documentos_router.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def read_root():
    """Endpoint de prueba para verificar que la API está funcionando."""
    return {"message": "Servicio de API iniciado. Revisa /docs para la documentación."}
