# src/app/modules/padres_estudiantes/models.py
from app.core.database import Base
from sqlalchemy import Column, Integer,DateTime, String, ForeignKey,Boolean
from sqlalchemy.orm import relationship
from app.utils.datetime import now_bolivia

class Padres_Estudiantes(Base):
    """Modelo de perfil de padres y estudiantes."""
    __tablename__ = "padres_estudiantes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    perfil_id = Column(Integer, ForeignKey("perfiles.id"), index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"), index=True)
    parentesco = Column(String(255))
    estado = Column(Boolean, default=False)
    observacion = Column(String(255), default="Solicitado")
    fecha_creacion = Column(DateTime(timezone=True), default=now_bolivia)
    fecha_actualizacion = Column(DateTime(timezone=True), default=now_bolivia, onupdate=now_bolivia)

    perfil = relationship("Perfil", back_populates="padres_estudiantes")
    estudiante = relationship("Estudiante", back_populates="padres_estudiantes")
    
