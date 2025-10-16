from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Crear motor (engine) usando la URL de config
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.SQLALCHEMY_DATABASE_URL else {}
)

# Configurar sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para modelos
Base = declarative_base()

# Dependencia de DB para FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
