# src/app/modules/estudiantes/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from . import schemas, service
from app.core.database import get_db
from app.modules.users.models import User
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"]
)

@router.get("/", response_model=List[schemas.EstudianteOut])
def list_estudiantes(skip: int = Query(0), limit: int = Query(100),
                     db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    estudiantes = service.get_all_estudiantes(db)
    return estudiantes[skip: skip + limit]

@router.get("/{estudiante_id}", response_model=schemas.EstudianteOut)
def get_estudiante(estudiante_id: int = Path(..., gt=0),
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    estudiante = service.get_estudiante_by_id(db, estudiante_id)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

@router.post("/", response_model=schemas.EstudianteOut, status_code=status.HTTP_201_CREATED)
def create_estudiante(estudiante_in: schemas.EstudianteCreate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    return service.create_estudiante(db, estudiante_in)

@router.put("/{estudiante_id}", response_model=schemas.EstudianteOut)
def update_estudiante(estudiante_id: int,
                      estudiante_update: schemas.EstudianteUpdate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    estudiante = service.update_estudiante(db, estudiante_id, estudiante_update)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

@router.delete("/{estudiante_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estudiante(estudiante_id: int,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    result = service.delete_estudiante(db, estudiante_id)
    if not result:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return {"detail": "Estudiante eliminado correctamente"}
