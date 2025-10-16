from pydantic import BaseModel
from typing import Optional
from datetime import date


class DocumentoEstudianteBase(BaseModel):
    estudiante_id: int
    catalogo_documento_id: int
    entregado: Optional[bool] = False
    fecha_entrega: Optional[date] = None
    archivo_digital: Optional[str] = None


class DocumentoEstudianteCreate(DocumentoEstudianteBase):
    pass


class DocumentoEstudianteUpdate(BaseModel):
    entregado: Optional[bool] = None
    fecha_entrega: Optional[date] = None
    archivo_digital: Optional[str] = None

class DocumentoEstudianteOut(DocumentoEstudianteBase):
    id: int

    model_config = {"from_attributes": True}
