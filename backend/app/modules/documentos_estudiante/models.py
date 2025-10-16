from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia


class DocumentoEstudiante(Base):
    __tablename__ = "documentos_estudiante"

    id = Column(Integer, primary_key=True, autoincrement=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), nullable=False)
    catalogo_documento_id = Column(Integer, ForeignKey("catalogo_documentos.id", ondelete="CASCADE"), nullable=False)
    entregado = Column(Boolean, default=False, nullable=False)
    fecha_entrega = Column(Date, nullable=True)
    archivo_digital = Column(String, nullable=True)
    fecha_registro= Column(Date, nullable=False, default=now_bolivia)
    fecha_actualizacion = Column(Date, nullable=False, default=now_bolivia, onupdate=now_bolivia)

    # Relaciones
    estudiante = relationship("Estudiante", back_populates="documentos_estudiante", lazy="joined")
    catalogo_documento = relationship("CatalogoDocumento", back_populates="documentos_estudiante")
