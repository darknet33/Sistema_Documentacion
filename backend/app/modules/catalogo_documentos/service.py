from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from . import models, schemas


def get_all_cat_documentos(db: Session):
    """Obtiene todos los cursos"""
    return db.query(models.CatalogoDocumento).all()


def get_cat_documento_by_id(db: Session, documeto_id: int):
    """Obtiene un curso por su ID"""
    documento = db.query(models.CatalogoDocumento).filter(models.CatalogoDocumento.id == documeto_id).first()
    if not documento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documento con ID {documeto_id} no encontrado"
        )
    return documento


def create_cat_documento(db: Session, documento_in: schemas.CatalogoDocumentosCreate):
    """Crea un nuevo curso"""
    # Validar nombre único
    existing = db.query(models.CatalogoDocumento).filter(models.CatalogoDocumento.nombre == documento_in.nombre).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un documento con el nombre '{documento_in.nombre}'"
        )

    nuevo_documento = models.CatalogoDocumento(
        nombre=documento_in.nombre,
        descripcion=documento_in.descripcion,
        es_obligatorio=documento_in.es_obligatorio,
        activo=documento_in.activo
    )
    db.add(nuevo_documento)
    db.commit()
    db.refresh(nuevo_documento)
    return nuevo_documento


def update_cat_documentos(db: Session, documeto_id: int, documento_in: schemas.CatalogoDocumentosUpdate):
    """Actualiza un curso existente"""
    documento = db.query(models.CatalogoDocumento).filter(models.CatalogoDocumento.id == documeto_id).first()
    if not documento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documento con ID {documeto_id} no encontrado"
        )

    # Actualiza solo los campos enviados
    for key, value in documento_in.dict(exclude_unset=True).items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return documento


def delete_cat_documentos(db: Session, documeto_id: int):
    """Elimina un curso por ID"""
    documento = db.query(models.CatalogoDocumento).filter(models.CatalogoDocumento.id == documeto_id).first()
    if not documento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documento con ID {documeto_id} no encontrado"
        )

    db.delete(documento)
    db.commit()
    return {"message": f"Documento con ID {documeto_id} eliminado correctamente"}
