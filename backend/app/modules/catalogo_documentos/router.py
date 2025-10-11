from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from . import schemas, service
from app.modules.users.models import User
from app.core.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/cat_documentos",
    tags=["Catalogo Documentos"]
)

# --- Listar documentos ---
@router.get("/", response_model=List[schemas.CatalogoDocumentosOut])
def list_documentos(skip: int = Query(0), limit: int = Query(100),
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    """Obtiene una lista de documentos (paginada)."""
    documentos = service.get_all_cat_documentos(db)
    return documentos[skip: skip + limit]


# --- Obtener un documento ---
@router.get("/{documento_id}", response_model=schemas.CatalogoDocumentosOut)
def get_documento(documento_id: int = Path(..., gt=0),
              db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    """Obtiene un documento por su ID."""
    documento = service.get_cat_documento_by_id(db, documento_id)
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento


# --- Crear un documento ---
@router.post("/", response_model=schemas.CatalogoDocumentosOut, status_code=status.HTTP_201_CREATED)
def create_documento(documento_in: schemas.CatalogoDocumentosCreate,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    """Crea un nuevo documento."""

    print(documento_in)
    nuevo_documento = service.create_cat_documento(db, documento_in)
    return nuevo_documento


# --- Actualizar curso ---
@router.put("/{documento_id}", response_model=schemas.CatalogoDocumentosOut)
def update_documento(documento_id: int,
                 documento_update: schemas.CatalogoDocumentosUpdate,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    """Actualiza un documento existente."""
    documento = service.update_cat_documentos(db, documento_id, documento_update)
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento

# Cambiar obligatorio
@router.patch("/{documento_id}/obligatorio", response_model=schemas.CatalogoDocumentosOut)
def toggle_documento_obligatorio(documento_id: int,
                        es_obligatorio: bool,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """Marca un documento como obligatorio o no."""
    documento = service.update_cat_documentos(db, documento_id, schemas.CatalogoDocumentosUpdate(es_obligatorio=es_obligatorio))
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento

# Activar/Desactivar
@router.patch("/{documento_id}/status", response_model=schemas.CatalogoDocumentosOut)
def toggle_documento_activo(documento_id: int,
                        activo: bool,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """Activa o desactiva un documento."""
    documento = service.update_cat_documentos(db, documento_id, schemas.CatalogoDocumentosUpdate(activo=activo))
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento

# --- Eliminar documento ---
@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(documento_id: int,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    """Elimina un documento."""
    result = service.delete_cat_documentos(db, documento_id)
    if not result:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return {"detail": "Documento eliminado correctamente"}
