# src/app/modules/estudiantes/service.py
from sqlalchemy.orm import Session, joinedload
from . import models, schemas
from typing import List

# Obtener todos los estudiantes con información del curso
def get_all_estudiantes(db: Session) -> List[models.Estudiante]:
    return (
        db.query(models.Estudiante)
        .options(joinedload(models.Estudiante.curso))  # Trae los datos del curso
        .order_by(models.Estudiante.id)
        .all()
    )

# Obtener estudiante por ID con información del curso
def get_estudiante_by_id(db: Session, estudiante_id: int):
    return (
        db.query(models.Estudiante)
        .options(joinedload(models.Estudiante.curso))  # Trae los datos del curso
        .filter(models.Estudiante.id == estudiante_id)
        .first()
    )

# Crear estudiante
def create_estudiante(db: Session, estudiante_in: schemas.EstudianteCreate):
    estudiante = models.Estudiante(**estudiante_in.dict())
    db.add(estudiante)
    db.commit()
    db.refresh(estudiante)
    return estudiante

# Actualizar estudiante
def update_estudiante(db: Session, estudiante_id: int, estudiante_in: schemas.EstudianteUpdate):
    estudiante = get_estudiante_by_id(db, estudiante_id)
    if not estudiante:
        return None
    for field, value in estudiante_in.dict(exclude_unset=True).items():
        setattr(estudiante, field, value)
    db.commit()
    db.refresh(estudiante)
    return estudiante

# Eliminar estudiante
def delete_estudiante(db: Session, estudiante_id: int):
    estudiante = get_estudiante_by_id(db, estudiante_id)
    if not estudiante:
        return None
    db.delete(estudiante)
    db.commit()
    return True
