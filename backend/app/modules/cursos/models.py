# src/app/modules/cursos/models.py
from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from app.core.database import Base

class Curso(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(255), nullable=False)
    nivel = Column(String(50), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint('nombre', 'nivel', name='uq_nombre_nivel'),
    )
