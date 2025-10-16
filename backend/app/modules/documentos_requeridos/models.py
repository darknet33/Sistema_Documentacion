# src/app/modules/documentos_requeridos/models.py
from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import date, timedelta

class DocumentoRequerido(Base):
    __tablename__ = "documentos_requeridos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    catalogo_documento_id = Column(Integer, ForeignKey("catalogo_documentos.id", ondelete="CASCADE"), nullable=False)
    curso_id = Column(Integer, ForeignKey("cursos.id", ondelete="CASCADE"), nullable=False)
    fecha_limite = Column(Date, nullable=True, default=lambda: date.today() + timedelta(days=45))

    # Relaciones ORM
    curso = relationship("Curso", back_populates="documentos_requeridos")
    catalogo_documento = relationship("CatalogoDocumento", back_populates="documentos_requeridos")
