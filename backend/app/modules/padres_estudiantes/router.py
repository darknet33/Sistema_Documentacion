from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.service import get_admin_user, get_padre_familia_user, get_current_user
from app.modules.usuarios.models import User
from . import schemas, service

router = APIRouter(
    prefix="/padres_estudiantes",
    tags=["Padres y Estudiantes"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren autenticación
)

# --- Helper interno ---
def get_relacion_or_404(db: Session, relacion_id: int):
    relacion = service.get_padres_estudiantes_by_id(db, relacion_id)
    if not relacion:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    return relacion

# --- Listar relaciones (solo admin) ---
@router.get("/", response_model=list[schemas.Padres_EstudiantesOut])
def listar_padres_estudiantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_padres_estudiantes(db, skip, limit)

# --- Obtener relaciones por perfil (solo padre/familia) ---
@router.get("/perfil/{perfil_id}", response_model=list[schemas.Padres_EstudiantesOut])
def obtener_padre_estudiantes(perfil_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_padre_familia_user)):
    return service.get_padres_estudiantes_by_perfil(db, perfil_id)

# --- Crear solicitud (solo padre/familia) ---
@router.post("/", response_model=schemas.Padres_EstudiantesOut, status_code=status.HTTP_201_CREATED)
def solicitar_padre_estudiante(padres_estudiantes_in: schemas.Padres_EstudiantesCreate, db: Session = Depends(get_db), current_user: User = Depends(get_padre_familia_user)):
    return service.create_relacion(db, padres_estudiantes_in)

# --- Eliminar relación (solo padre/familia) ---
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_padre_estudiante(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_padre_familia_user)):
    get_relacion_or_404(db, id)
    service.delete_relacion(db, id)
    return

# --- Aceptar solicitud (solo admin) ---
@router.patch("/{id}/aceptar", response_model=schemas.Padres_EstudiantesOut)
def aceptar_padre_estudiante(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    relacion = get_relacion_or_404(db, id)
    return service.aceptar_relacion(db, id)

# --- Rechazar solicitud (solo admin) ---
@router.patch("/{id}/rechazar", response_model=schemas.Padres_EstudiantesOut)
def rechazar_padre_estudiante(id: int, observacion: str = Body(None, embed=True), db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    get_relacion_or_404(db, id)
    return service.rechazar_relacion(db, id, observacion)
