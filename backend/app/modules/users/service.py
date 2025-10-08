# src/app/modules/users/crud.py
from sqlalchemy.orm import Session, joinedload
from app.modules.users import models, schemas
from app.modules.perfiles.models import Perfil
from typing import List, Optional

# --- Obtener usuario por email ---
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).options(joinedload(models.User.perfil)).filter(models.User.email == email).first()

# --- Obtener usuario por ID ---
def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).options(joinedload(models.User.perfil)).filter(models.User.id == user_id).first()

# --- Listar todos los usuarios ---
def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).options(joinedload(models.User.perfil)).offset(skip).limit(limit).all()

# --- Crear usuario (+ perfil opcional) ---
def create_user(db: Session, user: schemas.UserCreate, hashed_password: str) -> models.User:
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        tipo_usuario=user.tipo_usuario,
        activo=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # 👇 Si vino un perfil en el JSON, lo creamos también
    if user.perfil:
        db_perfil = Perfil(
            usuario_id=db_user.id,
            nombres=user.perfil.nombres,
            apellidos=user.perfil.apellidos,
            telefono=user.perfil.telefono
        )
        db.add(db_perfil)
        db.commit()
        db.refresh(db_perfil)

    return db_user

# --- Actualizar usuario ---
def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# --- Eliminar usuario ---
def delete_user(db: Session, user_id: int) -> bool:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True

# --- Activar / Desactivar usuario ---
def set_user_active(db: Session, user_id: int, activo: bool) -> Optional[models.User]:
    """
    Cambia el estado 'activo' de un usuario.
    Devuelve el usuario actualizado o None si no existe.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    db_user.activo = activo
    db.commit()
    db.refresh(db_user)
    return db_user
