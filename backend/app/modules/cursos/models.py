# src/app/modules/cursos/models.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Curso(Base):
    """ Modelo de cursos """
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True,autoincrement=True, index=True)
    nombre = Column(String(255), nullable=False, unique=True)
    nivel = Column(String(50), nulable=False)
    activo = Column(Boolean, default=True, nullable=False)

