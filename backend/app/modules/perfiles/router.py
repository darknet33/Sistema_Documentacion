# src/app/modules/perfiles/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Callable

from app.core.database import get_db
from app.modules.usuarios.models import User
from app.modules.auth.service import get_current_user
from . import schemas, service

router = APIRouter(
    prefix="/perfiles",
    tags=["Perfiles"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren usuario autenticado
)

# --- Helper para obtener perfil o lanzar 404 ---
def get_perfil_or_404(db: Session, usuario_id: int):
    perfil = service.get_perfil_by_usuario(db, usuario_id)
    if not perfil:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")
    return perfil


# --- Listar perfiles ---
@router.get("/", response_model=list[schemas.PerfilOut])
def listar_perfiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_perfiles(db, skip, limit)


# --- Obtener perfil por usuario ---
@router.get("/{usuario_id}", response_model=schemas.PerfilOut)
def obtener_perfil(usuario_id: int, db: Session = Depends(get_db)):
    return get_perfil_or_404(db, usuario_id)


# --- Crear perfil ---
@router.post("/", response_model=schemas.PerfilOut, status_code=status.HTTP_201_CREATED)
def crear_perfil(perfil_in: schemas.PerfilCreate, db: Session = Depends(get_db)):
    if service.get_perfil_by_usuario(db, perfil_in.usuario_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya tiene un perfil")
    return service.create_perfil(db, perfil_in)


# --- Actualizar perfil ---
@router.put("/{usuario_id}", response_model=schemas.PerfilOut)
def actualizar_perfil(usuario_id: int, updates: schemas.PerfilUpdate, db: Session = Depends(get_db)):
    perfil = get_perfil_or_404(db, usuario_id)
    return service.update_perfil(db, perfil, updates)
