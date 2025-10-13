from pydantic import BaseModel
from typing import Optional, List
from app.modules.estudiantes.schemas import EstudianteOut
from app.modules.documentos_requeridos.schemas import DocumentoRequeridoOut

class CursoBase(BaseModel):
    nombre: str
    nivel: str
    activo: Optional[bool] = True

class CursoOut(CursoBase):
    id: int
    estudiantes: Optional[List[EstudianteOut]] = []
    documentos_requeridos: Optional[List[DocumentoRequeridoOut]] = []

    class Config:
        orm_mode = True

class CursoCreate(CursoBase):
    """Schema para creación de cursos"""
    pass

class CursoUpdate(BaseModel):
    """Schema para actualización parcial de cursos"""
    nombre: Optional[str] = None
    nivel: Optional[str] = None
    activo: Optional[bool] = None

