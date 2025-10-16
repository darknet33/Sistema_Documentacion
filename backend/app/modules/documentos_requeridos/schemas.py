from pydantic import BaseModel
from datetime import date
from typing import Optional

class DocumentoRequeridoBase(BaseModel):
    catalogo_documento_id: int
    curso_id: int
    fecha_limite: Optional[date] = None


class DocumentoRequeridoCreate(DocumentoRequeridoBase):
    pass


class DocumentoRequeridoUpdate(BaseModel):
    fecha_limite: Optional[date] = None


class DocumentoRequeridoOut(BaseModel):
    id: int
    catalogo_documento_id: int
    curso_id: int
    fecha_limite: Optional[date] = None

    model_config = {"from_attributes": True}
