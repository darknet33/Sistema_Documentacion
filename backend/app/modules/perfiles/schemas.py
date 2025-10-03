# src/app/modules/perfiles/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PerfilBase(BaseModel):
    nombres: str
    apellidos: str
    telefono: Optional[str] = None

class PerfilCreate(PerfilBase):
    usuario_id: int  # Obligatorio al crear

class PerfilUpdate(BaseModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None

class PerfilOut(PerfilBase):
    id: int
    usuario_id: int
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True
