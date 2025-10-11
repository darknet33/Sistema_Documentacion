from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from . import models, schemas


def get_all_cursos(db: Session):
    """Obtiene todos los cursos"""
    return db.query(models.Curso).all()


def get_curso_by_id(db: Session, curso_id: int):
    """Obtiene un curso por su ID"""
    curso = db.query(models.Curso).filter(models.Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso con ID {curso_id} no encontrado"
        )
    return curso


def create_curso(db: Session, curso_in: schemas.CursoCreate):
    """Crea un nuevo curso"""
    # Validar nombre único
    existing = db.query(models.Curso).filter((models.Curso.nombre == curso_in.nombre) & (models.Curso.nivel == curso_in.nivel)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un curso con el nombre '{curso_in.nombre}' '{curso_in.nivel}'"
        )

    nuevo_curso = models.Curso(
        nombre=curso_in.nombre,
        nivel=curso_in.nivel,
        activo=curso_in.activo
    )
    db.add(nuevo_curso)
    db.commit()
    db.refresh(nuevo_curso)
    return nuevo_curso


def update_curso(db: Session, curso_id: int, curso_in: schemas.CursoUpdate):
    """Actualiza un curso existente"""
    curso = db.query(models.Curso).filter(models.Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso con ID {curso_id} no encontrado"
        )

    # Actualiza solo los campos enviados
    for key, value in curso_in.dict(exclude_unset=True).items():
        setattr(curso, key, value)

    db.commit()
    db.refresh(curso)
    return curso


def delete_curso(db: Session, curso_id: int):
    """Elimina un curso por ID"""
    curso = db.query(models.Curso).filter(models.Curso.id == curso_id).first()
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Curso con ID {curso_id} no encontrado"
        )

    db.delete(curso)
    db.commit()
    return {"message": f"Curso con ID {curso_id} eliminado correctamente"}
