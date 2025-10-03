from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator

# Nombre del archivo SQLite para pruebas
SQLITE_FILE_NAME = "test.db"

# URL de conexión a la base de datos SQLite
# check_same_thread=False es necesario para SQLite con FastAPI
SQLALCHEMY_DATABASE_URL = f"sqlite:///{SQLITE_FILE_NAME}"

# Crea el motor (engine) de la base de datos
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Configura la sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para definir los modelos de SQLAlchemy
Base = declarative_base()

# Dependencia de la base de datos (Database Dependency)
# Esta función es un generador que se usará en los endpoints para obtener una sesión.
def get_db() -> Generator:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()