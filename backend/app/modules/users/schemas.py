# src/app/modules/users/schemas.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from app.modules.perfiles.schemas import PerfilOut, PerfilCreate

class UserBase(BaseModel):
    email: EmailStr
    tipo_usuario: str = "administrador"

    @field_validator('tipo_usuario', mode='before')
    def validate_tipo_usuario(cls, v):
        if v not in ("administrador", "administrativo", "padre_familia"):
            raise ValueError("Tipo de usuario inválido")
        return v

class UserCreate(UserBase):
    password: str
    perfil: Optional[PerfilCreate] = None  # 👈 Permite crear user + perfil juntos

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    tipo_usuario: Optional[str] = None
    password: Optional[str] = None
    activo: Optional[bool] = None

class UserOut(UserBase):
    id: int
    activo: bool
    fecha_creacion: datetime
    perfil: Optional[PerfilOut] = None

    model_config = {"from_attributes": True}

