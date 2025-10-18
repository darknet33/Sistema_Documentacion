from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas
from app.utils.datetime import today_bolivia
from typing import Optional
from datetime import date

def get_all_documento_estudiante(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DocumentoEstudiante).offset(skip).limit(limit).all()

def create_documento_estudiante(db: Session, data: schemas.DocumentoEstudianteCreate):
    # Evitar duplicados exactos
    existente = db.query(models.DocumentoEstudiante).filter_by(
        estudiante_id=data.estudiante_id,
        catalogo_documento_id=data.catalogo_documento_id
    ).first()
    if existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Documento ya registrado para este estudiante")

    nuevo = models.DocumentoEstudiante(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def get_documento_estudiante_by_id(db: Session, doc_id: int):
    return db.query(models.DocumentoEstudiante).get(doc_id)


def get_by_estudiante(db: Session, estudiante_id: int):
    return db.query(models.DocumentoEstudiante).filter_by(estudiante_id=estudiante_id).all()


def update_documento_estudiante(db: Session, doc_id: int, update: schemas.DocumentoEstudianteUpdate):
    doc = db.query(models.DocumentoEstudiante).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="No encontrado")
    for k, v in update.dict(exclude_unset=True).items():
        setattr(doc, k, v)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def delete_documento_estudiante(db: Session, doc_id: int):
    doc = db.query(models.DocumentoEstudiante).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(doc)
    db.commit()
    return {"ok": True}

# --- Aprobar Documento ---
def aprobar_documento(db: Session, doc_id: int, nueva_fecha_vencimiento: Optional[date] = None):
    doc = db.query(models.DocumentoEstudiante).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    # Si se envía una nueva fecha, se actualiza
    if nueva_fecha_vencimiento is not None:
        doc.fecha_vencimiento = nueva_fecha_vencimiento

    # Si no, se deja la misma fecha existente
    doc.observaciones = "Recepcionado y Verificado"
    doc.entregado = True

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


# --- Rechazar Documento ---
def rechazar_documento(db: Session, doc_id: int, observacion: str):
    doc = db.query(models.DocumentoEstudiante).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    doc.entregado = False
    doc.observaciones = observacion

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


# --- Reenviar Documento ---
def reenviar_documento(db: Session, doc_id: int, archivo_url: str):
    doc = db.query(models.DocumentoEstudiante).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    doc.archivo_digital = archivo_url
    doc.entregado = True
    doc.observaciones = "Enviado por Confirmar"
    doc.fecha_vencimiento = None
    doc.fecha_entrega = today_bolivia()

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
