# src/app/modules/users/schemas.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

# --- Esquemas Base ---

class UserBase(BaseModel):
    """Esquema base para lectura/escritura de usuario."""
    email: EmailStr
    tipo_usuario: Optional[str] = "administrador"

    @field_validator('tipo_usuario', mode='before')
    def validate_tipo_usuario(cls, v):
        if v not in ["administrador", "administrativo", "padre_familia"]:
            raise ValueError('El tipo de usuario debe ser "administrador", "administrativo" o "padre_familia"')
        return v

class UserCreate(UserBase):
    """Esquema para crear un usuario (incluye password)."""
    password: str

class UserUpdate(BaseModel):
    """Esquema para actualizar un usuario; todos los campos son opcionales."""
    email: Optional[EmailStr] = None
    tipo_usuario: Optional[str] = None
    password: Optional[str] = None
    activo: Optional[bool] = None

    @field_validator('tipo_usuario', mode='before')
    def validate_tipo_usuario(cls, v):
        if v is not None and v not in ["administrador", "administrativo", "padre_familia"]:
            raise ValueError('El tipo de usuario debe ser "administrador", "administrativo" o "padre_familia"')
        return v

class UserOut(UserBase):
    """Esquema de salida del usuario (sin password)."""
    id: int
    activo: bool
    tipo_usuario: str
    fecha_creacion: datetime

    class Config:
        from_attributes = True


