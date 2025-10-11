from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class CursoOut(BaseModel):
    id: int
    nombre: str
    nivel: str

    class Config:
        orm_mode = True

class EstudianteBase(BaseModel):
    codigo_estudiante: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    curso_id: Optional[int] = None
    activo: Optional[bool] = True

class EstudianteCreate(EstudianteBase):
    pass

class EstudianteUpdate(BaseModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    curso_id: Optional[int] = None
    activo: Optional[bool] = None

class EstudianteOut(EstudianteBase):
    id: int
    fecha_creacion: datetime
    curso: Optional[CursoOut] = None  # <-- Información completa del curso

    class Config:
        orm_mode = True
