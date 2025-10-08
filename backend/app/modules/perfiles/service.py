# src/app/modules/perfiles/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

def get_perfil_by_usuario(db: Session, usuario_id: int) -> models.Perfil | None:
    return db.query(models.Perfil).filter(models.Perfil.usuario_id == usuario_id).first()

def create_perfil(db: Session, perfil_in: schemas.PerfilCreate) -> models.Perfil:
    perfil = models.Perfil(**perfil_in.dict())
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return perfil

def update_perfil(db: Session, perfil: models.Perfil, updates: schemas.PerfilUpdate) -> models.Perfil:
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(perfil, field, value)
    db.commit()
    db.refresh(perfil)
    return perfil

def get_perfiles(db: Session, skip: int = 0, limit: int = 100) -> list[models.Perfil]:
    return db.query(models.Perfil).offset(skip).limit(limit).all()
