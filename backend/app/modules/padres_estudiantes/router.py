# src/app/modules/padres_estudiantes/router.py
from fastapi import APIRouter, Depends, HTTPException, status,Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from . import schemas, service
from app.modules.users.models import  User 
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/padres_estudiantes",
    tags=["Padres y Estudiantes"]
)

@router.get("/", response_model=list[schemas.Padres_EstudiantesOut])
def listar_padres_estudiantes(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.get_padres_estudiantes(db, skip, limit)

@router.get("/{perfil_id}", response_model=list[schemas.Padres_EstudiantesOut])
def listar_padres_estudiantes(
    perfil_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.get_padres_estudiantes_by_perfil(db, perfil_id)

@router.post("/", response_model=schemas.Padres_EstudiantesOut, status_code=status.HTTP_201_CREATED)
def crear_padres_estudiantes(
    padres_estudiantes_in: schemas.Padres_EstudiantesCreate, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.create_padres_estudiantes(db, padres_estudiantes_in)

@router.put("/{padres_estudiantes_id}", response_model=schemas.Padres_EstudiantesOut)
def actualizar_padres_estudiantes(
    padres_estudiantes_id: int, updates: schemas.Padres_EstudiantesUpdate, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.update_padres_estudiantes(db, padres_estudiantes_id, updates)

# --- Eliminar relación padre-estudiante ---
@router.delete("/{padres_estudiantes_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_padres_estudiantes(
    padres_estudiantes_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = service.delete_padres_estudiantes(db, padres_estudiantes_id)
    if not success:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    # No devolvemos nada; con status 204 basta
    return

# --- Aceptar solicitud ---
@router.patch("/{id}/aceptar", response_model=schemas.Padres_EstudiantesOut)
def aceptar_padre_estudiante(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    relacion = service.aceptar_relacion(db, id)
    if not relacion:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    return relacion

# --- Rechazar solicitud ---
@router.patch("/{id}/rechazar", response_model=schemas.Padres_EstudiantesOut)
def rechazar_padre_estudiante(
    id: int,
    observacion: str = Body(None, embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    relacion = service.rechazar_relacion(db, id, observacion)
    if not relacion:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    return relacion

