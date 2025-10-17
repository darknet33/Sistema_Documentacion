# src/app/modules/padres_estudiantes/service.py
from sqlalchemy.orm import Session
from . import models, schemas

def get_padres_estudiantes(db: Session, skip: int = 0, limit: int = 100) -> list[models.Padres_Estudiantes]:
    return db.query(models.Padres_Estudiantes).offset(skip).limit(limit).all()

def get_padres_estudiantes_by_id(db:Session, id: int) -> models.Padres_Estudiantes:
    return db.query(models.Padres_Estudiantes).filter(models.Padres_Estudiantes.id == id).first()

def create_relacion(db: Session, padres_estudiantes_in: schemas.Padres_EstudiantesCreate) -> models.Padres_Estudiantes:
    padres_estudiantes = models.Padres_Estudiantes(**padres_estudiantes_in.dict())
    db.add(padres_estudiantes)
    db.commit()
    db.refresh(padres_estudiantes)
    return padres_estudiantes
    
def delete_relacion(db: Session, padres_estudiantes_id: int) -> models.Padres_Estudiantes:
    padres_estudiantes = db.query(models.Padres_Estudiantes).filter(models.Padres_Estudiantes.id == padres_estudiantes_id).first()
    if not padres_estudiantes:
        return False
    db.delete(padres_estudiantes)
    db.commit()
    return True


def get_padres_estudiantes_by_perfil(db: Session, perfil_id: int) -> list[models.Padres_Estudiantes] | None:
    return db.query(models.Padres_Estudiantes).filter(models.Padres_Estudiantes.perfil_id == perfil_id).all()

def aceptar_relacion(db: Session, relacion_id: int) -> models.Padres_Estudiantes:
    rel = db.query(models.Padres_Estudiantes).filter_by(id=relacion_id).first()
    if not rel:
        return None
    rel.estado = True
    rel.observacion = "Aceptado"
    db.commit()
    db.refresh(rel)
    return rel


def rechazar_relacion(db: Session, relacion_id: int, observacion: str | None = None) -> models.Padres_Estudiantes:
    rel = db.query(models.Padres_Estudiantes).filter_by(id=relacion_id).first()
    if not rel:
        return None
    rel.estado = False
    rel.observacion = observacion or "Rechazado"
    db.commit()
    db.refresh(rel)
    return rel
