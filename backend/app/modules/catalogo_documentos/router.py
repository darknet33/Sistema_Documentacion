from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from . import schemas, service
from app.modules.usuarios.models import User
from app.core.database import get_db
from app.modules.auth.service import get_current_user

router = APIRouter(
    prefix="/cat_documentos",
    tags=["Catalogo Documentos"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren autenticación
)

# --- Helpers internos ---
def get_documento_or_404(db: Session, documento_id: int):
    doc = service.get_cat_documento_by_id(db, documento_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return doc


# --- Listar documentos ---
@router.get("/", response_model=List[schemas.CatalogoDocumentosOut])
def list_documentos(skip: int = Query(0), limit: int = Query(100), db: Session = Depends(get_db)):
    documentos = service.get_all_cat_documentos(db)
    return documentos[skip: skip + limit]


# --- Obtener un documento ---
@router.get("/{documento_id}", response_model=schemas.CatalogoDocumentosOut)
def get_documento(documento_id: int = Path(..., gt=0), db: Session = Depends(get_db)):
    return get_documento_or_404(db, documento_id)


# --- Crear un documento ---
@router.post("/", response_model=schemas.CatalogoDocumentosOut, status_code=status.HTTP_201_CREATED)
def create_documento(documento_in: schemas.CatalogoDocumentosCreate, db: Session = Depends(get_db)):
    nuevo_documento = service.create_cat_documento(db, documento_in)
    return nuevo_documento


# --- Actualizar documento ---
@router.put("/{documento_id}", response_model=schemas.CatalogoDocumentosOut)
def update_documento(documento_id: int,
                      documento_update: schemas.CatalogoDocumentosUpdate,
                      db: Session = Depends(get_db)):
    # Verificamos existencia
    get_documento_or_404(db, documento_id)
    documento = service.update_cat_documentos(db, documento_id, documento_update)
    return documento


# --- Cambiar obligatorio ---
@router.patch("/{documento_id}/obligatorio", response_model=schemas.CatalogoDocumentosOut)
def toggle_documento_obligatorio(documento_id: int, es_obligatorio: bool, db: Session = Depends(get_db)):
    get_documento_or_404(db, documento_id)
    return service.update_cat_documentos(
        db, documento_id, schemas.CatalogoDocumentosUpdate(es_obligatorio=es_obligatorio)
    )


# --- Activar/Desactivar ---
@router.patch("/{documento_id}/status", response_model=schemas.CatalogoDocumentosOut)
def toggle_documento_activo(documento_id: int, activo: bool, db: Session = Depends(get_db)):
    get_documento_or_404(db, documento_id)
    return service.update_cat_documentos(
        db, documento_id, schemas.CatalogoDocumentosUpdate(activo=activo)
    )


# --- Eliminar documento ---
@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(documento_id: int, db: Session = Depends(get_db)):
    get_documento_or_404(db, documento_id)
    service.delete_cat_documentos(db, documento_id)
    return {"detail": "Documento eliminado correctamente"}
