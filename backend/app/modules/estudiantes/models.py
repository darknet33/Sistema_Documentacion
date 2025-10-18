# src/app/modules/estudiantes/models.py
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cedula_identidad = Column(String(255), unique=True, nullable=False)
    nombres = Column(String(255), nullable=False)
    apellidos = Column(String(255), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    curso_id = Column(Integer, ForeignKey("cursos.id", ondelete="SET NULL"), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), default=now_bolivia)

    # Relaciones
    curso = relationship("Curso", back_populates="estudiantes")
    padres_estudiantes = relationship("Padres_Estudiantes", back_populates="estudiante", cascade="all, delete-orphan")
    documentos_estudiante = relationship("DocumentoEstudiante", back_populates="estudiante", cascade="all, delete-orphan")
