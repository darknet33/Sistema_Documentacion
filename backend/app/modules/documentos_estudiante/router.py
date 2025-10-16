from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.service import get_current_user
from app.modules.usuarios.models import User
from . import service, schemas

router = APIRouter(
    prefix="/documentos_estudiante",
    tags=["Documentos Estudiante"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren usuario autenticado
)

# --- Helper interno ---
def get_doc_or_404(db: Session, doc_id: int):
    doc = service.get_documento_estudiante_by_id(db, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return doc


# --- Listar documentos de un estudiante ---
@router.get("/estudiante/{estudiante_id}", response_model=list[schemas.DocumentoEstudianteOut])
def get_by_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return service.get_by_estudiante(db, estudiante_id)


# --- Crear documento ---
@router.post("/", response_model=schemas.DocumentoEstudianteOut, status_code=status.HTTP_201_CREATED)
def create_documento(req: schemas.DocumentoEstudianteCreate, db: Session = Depends(get_db)):
    return service.create_documento_estudiante(db, req)


# --- Actualizar documento ---
@router.put("/{doc_id}", response_model=schemas.DocumentoEstudianteOut)
def update_documento(doc_id: int, req: schemas.DocumentoEstudianteUpdate, db: Session = Depends(get_db)):
    get_doc_or_404(db, doc_id)
    return service.update_documento_estudiante(db, doc_id, req)


# --- Eliminar documento ---
@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(doc_id: int, db: Session = Depends(get_db)):
    get_doc_or_404(db, doc_id)
    service.delete_documento_estudiante(db, doc_id)
    return {"detail": "Documento eliminado correctamente"}
