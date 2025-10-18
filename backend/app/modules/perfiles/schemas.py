# src/app/modules/perfiles/schemas.py
from pydantic import BaseModel
from typing import Optional

class PerfilBase(BaseModel):
    cedula_identidad: Optional[str] = None
    nombres: str
    apellidos: str
    telefono: Optional[str] = None

class PerfilCreate(PerfilBase):
    pass

class PerfilUpdate(BaseModel):
    cedula_identidad: Optional[str] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None

class PerfilOut(PerfilBase):
    id: int

    model_config = {"from_attributes": True}
