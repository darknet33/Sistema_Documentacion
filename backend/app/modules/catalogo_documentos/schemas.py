from pydantic import BaseModel
from  typing import Optional

class CatalogoDocumetosBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    es_obligatorio: Optional[bool] = True
    activo:Optional[bool] = True

class CatalogoDocumentosCreate(CatalogoDocumetosBase):
    pass

class CatalogoDocumentosUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    es_obligatorio: Optional[bool] = True
    activo:Optional[bool] = True

class CatalogoDocumentosOut(CatalogoDocumetosBase):
    id: int

    class Config:
        orm_mode = True
