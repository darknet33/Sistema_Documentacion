from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas

def create_documento_requerido(db: Session, data: schemas.DocumentoRequeridoCreate):
    existente = db.query(models.DocumentoRequerido).filter_by(
        catalogo_documento_id=data.catalogo_documento_id,
        curso_id=data.curso_id
    ).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este documento ya fue asignado a este curso."
        )
    nuevo = models.DocumentoRequerido(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def get_by_curso(db: Session, curso_id: int):
    return db.query(models.DocumentoRequerido).filter_by(curso_id=curso_id).all()


def delete_documento_requerido(db: Session, doc_id: int):
    doc = db.query(models.DocumentoRequerido).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(doc)
    db.commit()
    return {"ok": True}
