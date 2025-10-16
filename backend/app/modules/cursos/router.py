from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from app.modules.cursos import schemas, service
from app.core.database import get_db
from app.modules.auth.service import get_current_user

router = APIRouter(
    prefix="/cursos",
    tags=["Cursos"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren usuario autenticado
)

# --- Helper interno ---
def get_curso_or_404(db: Session, curso_id: int):
    curso = service.get_curso_by_id(db, curso_id)
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return curso


# --- Listar cursos ---
@router.get("/", response_model=List[schemas.CursoOut])
def list_cursos(skip: int = Query(0), limit: int = Query(100), db: Session = Depends(get_db)):
    cursos = service.get_all_cursos(db)
    return cursos[skip: skip + limit]


# --- Listar cursos con estudiantes y documentos ---
@router.get("/completo", response_model=List[schemas.CursoOut])
def list_cursos_completo(db: Session = Depends(get_db)):
    """
    Devuelve todos los cursos con:
    - estudiantes asociados
    - documentos requeridos asociados
    """
    return service.get_all_cursos_completo(db)


# --- Obtener un curso ---
@router.get("/{curso_id}", response_model=schemas.CursoOut)
def get_curso(curso_id: int = Path(..., gt=0), db: Session = Depends(get_db)):
    return get_curso_or_404(db, curso_id)


# --- Crear un curso ---
@router.post("/", response_model=schemas.CursoOut, status_code=status.HTTP_201_CREATED)
def create_curso(curso_in: schemas.CursoCreate, db: Session = Depends(get_db)):
    return service.create_curso(db, curso_in)


# --- Actualizar curso ---
@router.put("/{curso_id}", response_model=schemas.CursoOut)
def update_curso(curso_id: int, curso_update: schemas.CursoUpdate, db: Session = Depends(get_db)):
    get_curso_or_404(db, curso_id)
    return service.update_curso(db, curso_id, curso_update)


# --- Activar/Desactivar curso ---
@router.patch("/{curso_id}/status", response_model=schemas.CursoOut)
def toggle_curso_status(curso_id: int, activo: bool, db: Session = Depends(get_db)):
    get_curso_or_404(db, curso_id)
    return service.update_curso(db, curso_id, schemas.CursoUpdate(activo=activo))


# --- Eliminar curso ---
@router.delete("/{curso_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_curso(curso_id: int, db: Session = Depends(get_db)):
    get_curso_or_404(db, curso_id)
    service.delete_curso(db, curso_id)
    return {"detail": "Curso eliminado correctamente"}
