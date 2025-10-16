# src/app/modules/padres_estudiantes/schemas.py
from pydantic import BaseModel
from typing import Optional
from app.modules.perfiles.schemas import PerfilOut
from app.modules.estudiantes.schemas import EstudianteOut
from datetime import datetime

class Padres_EstudiantesBase(BaseModel):
    perfil_id: int
    estudiante_id: int
    parentesco: str


class Padres_EstudiantesOut(Padres_EstudiantesBase):
    id: int
    perfil: PerfilOut
    estudiante: EstudianteOut
    estado: bool
    observacion: str
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = {"from_attributes": True}


class Padres_EstudiantesCreate(Padres_EstudiantesBase):
    pass

class Padres_EstudiantesUpdate(BaseModel):
    perfil_id: Optional[int] = None
    estudiante_id: Optional[int] = None
    parentesco: Optional[str] = None
    estado: Optional[bool] = None
    observacion: Optional[str] = None


class ObservacionIn(BaseModel):
    observacion: Optional[str] = None
