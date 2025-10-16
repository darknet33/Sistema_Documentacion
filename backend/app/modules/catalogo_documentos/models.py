# src/app/modules/catalogo_documentos/models.py
from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base  # Asegúrate de que tu Base declarativa esté importada

class CatalogoDocumento(Base):
    """Modelo para la tabla catalogo_documentos"""
    __tablename__ = "catalogo_documentos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)
    es_obligatorio = Column(Boolean, default=True, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)

    # Relaciones
    documentos_requeridos = relationship("DocumentoRequerido", back_populates="catalogo_documento", cascade="all, delete-orphan")
    documentos_estudiante = relationship("DocumentoEstudiante", back_populates="catalogo_documento", cascade="all, delete-orphan")