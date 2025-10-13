# src/app/modules/perfiles/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia

class Perfil(Base):
    """Modelo de perfiles de usuario."""
    __tablename__ = "perfiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=True)
    fecha_actualizacion = Column(DateTime(timezone=True), default=now_bolivia, onupdate=now_bolivia, nullable=False)

    usuario = relationship("User", back_populates="perfil")
    padres_estudiantes = relationship("Padres_Estudiantes", back_populates="perfil", cascade="all, delete-orphan")