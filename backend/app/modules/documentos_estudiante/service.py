from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas


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
