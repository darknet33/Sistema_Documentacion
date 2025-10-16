from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from . import schemas, service
from app.core.database import get_db
from app.modules.auth.service import get_current_user
from app.modules.usuarios.models import User

router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren usuario autenticado
)

# --- Helper interno ---
def get_estudiante_or_404(db: Session, estudiante_id: int):
    estudiante = service.get_estudiante_by_id(db, estudiante_id)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

# --- Listar estudiantes ---
@router.get("/", response_model=List[schemas.EstudianteOut])
def list_estudiantes(skip: int = Query(0), limit: int = Query(100), db: Session = Depends(get_db)):
    estudiantes = service.get_all_estudiantes(db)
    return estudiantes[skip: skip + limit]

# --- Obtener un estudiante ---
@router.get("/{estudiante_id}", response_model=schemas.EstudianteOut)
def get_estudiante(estudiante_id: int = Path(..., gt=0), db: Session = Depends(get_db)):
    return get_estudiante_or_404(db, estudiante_id)

# --- Crear estudiante ---
@router.post("/", response_model=schemas.EstudianteOut, status_code=status.HTTP_201_CREATED)
def create_estudiante(estudiante_in: schemas.EstudianteCreate, db: Session = Depends(get_db)):
    return service.create_estudiante(db, estudiante_in)

# --- Actualizar estudiante ---
@router.put("/{estudiante_id}", response_model=schemas.EstudianteOut)
def update_estudiante(estudiante_id: int, estudiante_update: schemas.EstudianteUpdate, db: Session = Depends(get_db)):
    get_estudiante_or_404(db, estudiante_id)
    estudiante = service.update_estudiante(db, estudiante_id, estudiante_update)
    return estudiante

# --- Eliminar estudiante ---
@router.delete("/{estudiante_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    get_estudiante_or_404(db, estudiante_id)
    service.delete_estudiante(db, estudiante_id)
    return {"detail": "Estudiante eliminado correctamente"}
