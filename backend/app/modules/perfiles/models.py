# src/app/modules/perfiles/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Perfil(Base):
    """Modelo de perfiles de usuario."""
    __tablename__ = "perfiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=True)
    fecha_actualizacion = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    usuario = relationship("User", back_populates="perfil")
