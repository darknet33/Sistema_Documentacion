# app/modules/users/service.py
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import List, Optional
from passlib.context import CryptContext

from app.modules.usuarios import models, schemas
from app.modules.perfiles.models import Perfil

# ==========================================================
# 🔐 AUTENTICACIÓN DE USUARIO
# ==========================================================
def authenticate_user(db: Session, email: str, password: Optional[str] = None) -> models.User:
    """Autentica a un usuario, validando credenciales y estado."""
    user = get_user_by_email(db, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado."
        )

    if password and not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta."
        )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario está inactivo."
        )

    return user


# ==========================================================
# 🔎 CONSULTAS
# ==========================================================
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return (
        db.query(models.User)
        .options(joinedload(models.User.perfil))
        .filter(models.User.email == email)
        .first()
    )


def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return (
        db.query(models.User)
        .options(joinedload(models.User.perfil))
        .filter(models.User.id == user_id)
        .first()
    )


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return (
        db.query(models.User)
        .options(joinedload(models.User.perfil))
        .offset(skip)
        .limit(limit)
        .all()
    )


# ==========================================================
# 🧱 CRUD BÁSICO
# ==========================================================
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Crea un nuevo usuario y su perfil asociado (si se envía)."""
    hashed_password = hash_password(user.password)

    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        tipo_usuario=user.tipo_usuario,
        activo=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Crear perfil si viene en la solicitud
    if user.perfil:
        perfil = Perfil(usuario_id=db_user.id, **user.perfil.model_dump())
        db.add(perfil)
        db.commit()
        db.refresh(perfil)

    return db_user


def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    """Actualiza usuario y su perfil (si corresponde)."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    # Actualizar campos simples
    for field, value in user_update.model_dump(exclude_unset=True).items():
        if field != "perfil":
            setattr(db_user, field, value)

    # Actualizar perfil si vino
    if user_update.perfil:
        perfil = db.query(Perfil).filter(Perfil.usuario_id == user_id).first()
        if not perfil:
            raise HTTPException(status_code=404, detail="Perfil no encontrado.")
        for field, value in user_update.perfil.model_dump(exclude_unset=True).items():
            setattr(perfil, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """Elimina usuario (y perfil si existe)."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    db.delete(user)
    db.commit()
    return True


def set_user_active(db: Session, user_id: int, activo: bool) -> models.User:
    """Activa o desactiva un usuario."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    user.activo = activo
    db.commit()
    db.refresh(user)
    return user


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==========================================================
# 🔑 HASHING
# ==========================================================
def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)
