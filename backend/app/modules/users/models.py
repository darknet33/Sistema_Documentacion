# src/app/modules/users/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia

class User(Base):
    """Modelo de base de datos para la tabla 'usuarios'."""
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(
        Enum('administrador', 'administrativo', 'padre_familia', name="tipo_usuario_enum"),
        nullable=False, index=True
    )
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), default=now_bolivia, nullable=False)

    perfil = relationship("Perfil", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
