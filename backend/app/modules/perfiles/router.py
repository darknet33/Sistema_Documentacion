# src/app/modules/perfiles/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from . import schemas, service
from app.modules.users.models import  User 
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/perfiles",
    tags=["Perfiles"]
)

@router.get("/", response_model=list[schemas.PerfilOut])
def listar_perfiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    return service.get_perfiles(db, skip, limit)

@router.get("/", response_model=list[schemas.PerfilOut])
def listar_perfiles(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    return service.get_perfiles(db, skip, limit)


@router.get("/{usuario_id}", response_model=schemas.PerfilOut)
def obtener_perfil(
    usuario_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) 
):
    perfil = service.get_perfil_by_usuario(db, usuario_id)
    if not perfil:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")
    return perfil


@router.post("/", response_model=schemas.PerfilOut, status_code=status.HTTP_201_CREATED)
def crear_perfil(
    perfil_in: schemas.PerfilCreate, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if service.get_perfil_by_usuario(db, perfil_in.usuario_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya tiene un perfil")
    return service.create_perfil(db, perfil_in)


@router.put("/{usuario_id}", response_model=schemas.PerfilOut)
def actualizar_perfil(
    usuario_id: int, updates: schemas.PerfilUpdate, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    perfil = service.get_perfil_by_usuario(db, usuario_id)
    if not perfil:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")
    return service.update_perfil(db, perfil, updates)
