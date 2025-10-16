from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.documentos_requeridos import service, schemas
from app.modules.auth.service import get_current_user

router = APIRouter(
    prefix="/documentos_requeridos",
    tags=["Documentos Requeridos"],
    dependencies=[Depends(get_current_user)]  # Todos requieren usuario autenticado
)

# --- Helper interno ---
def get_doc_or_404(db: Session, doc_id: int):
    doc = service.get_documento_requerido_by_id(db, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return doc

# --- Listar documentos por curso ---
@router.get("/curso/{curso_id}", response_model=list[schemas.DocumentoRequeridoOut])
def get_by_curso(curso_id: int, db: Session = Depends(get_db)):
    return service.get_by_curso(db, curso_id)

# --- Crear documento requerido ---
@router.post("/", response_model=schemas.DocumentoRequeridoOut, status_code=status.HTTP_201_CREATED)
def create(req: schemas.DocumentoRequeridoCreate, db: Session = Depends(get_db)):
    return service.create_documento_requerido(db, req)

# --- Eliminar documento requerido ---
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db)):
    get_doc_or_404(db, id)
    service.delete_documento_requerido(db, id)
    return {"detail": "Documento eliminado correctamente"}
