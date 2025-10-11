from pydantic import BaseModel
from typing import Optional


class CursoBase(BaseModel):
    """Campos base compartidos entre los esquemas"""
    nombre: str
    nivel: str
    activo: Optional[bool] = True


class CursoCreate(CursoBase):
    """Schema para creación de cursos"""
    pass


class CursoUpdate(BaseModel):
    """Schema para actualización parcial de cursos"""
    nombre: Optional[str] = None
    nivel: Optional[str] = None
    activo: Optional[bool] = None


class CursoOut(CursoBase):
    """Schema para salida de datos (lectura)"""
    id: int

    class Config:
        orm_mode = True
