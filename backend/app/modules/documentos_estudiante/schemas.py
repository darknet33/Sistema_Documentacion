from pydantic import BaseModel
from typing import Optional
from datetime import date

class CursoOut(BaseModel):
    nombre: str
    nivel: str

class EstudianteOut(BaseModel):
    cedula_identidad: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    curso_id: Optional[int] = None
    activo: Optional[bool] = True
    curso: Optional[CursoOut] = None  # <-- Información completa del curso

    model_config = {"from_attributes": True}

class CatalogoDocumetosOut(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    es_obligatorio: Optional[bool] = True
    activo:Optional[bool] = True

class DocumentoEstudianteBase(BaseModel):
    estudiante_id: int
    catalogo_documento_id: int
    entregado: Optional[bool] = False
    fecha_entrega: Optional[date] = None
    archivo_digital: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    observaciones: Optional[str] = None
class DocumentoEstudianteCreate(DocumentoEstudianteBase):
    pass


class DocumentoEstudianteUpdate(BaseModel):
    entregado: Optional[bool] = None
    fecha_vencimiento: Optional[date] = None
    observaciones: Optional[str] = None

class DocumentoEstudianteOut(DocumentoEstudianteBase):
    id: int
    estudiante: Optional[EstudianteOut] = None
    catalogo_documento: Optional[CatalogoDocumetosOut] = None

    model_config = {"from_attributes": True}
