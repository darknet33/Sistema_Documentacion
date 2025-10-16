# src/app/modules/users/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List

from app.modules.usuarios import schemas, models, service
from app.core.database import get_db
from app.modules.auth.service import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Usuarios"]
)

# --- Listar usuarios ---
@router.get("/", response_model=List[schemas.UserOut])
def list_users(skip: int = Query(0), limit: int = Query(100),
               db: Session = Depends(get_db)):
     return service.get_users(db, skip=skip, limit=limit)

# --- Obtener un usuario ---
@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int = Path(...), db: Session = Depends(get_db),
             current_user: models.User = Depends(get_current_user)):
    user = service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# --- Registro de usuarios ---
@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """Crea un nuevo usuario."""
    if service.get_user_by_email(db, email=user_in.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está registrado.")
    
    new_user = service.create_user(db, user=user_in)
    return new_user

# --- Actualizar usuario ---
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_update: schemas.UserUpdate,
                db: Session = Depends(get_db),
             current_user: models.User = Depends(get_current_user)):
    updated_user = service.update_user(db, user_id=user_id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return updated_user

# --- Activar/Desactivar usuario ---
@router.patch("/{user_id}/status", response_model=schemas.UserOut)
def toggle_user_status(user_id: int, activo: bool, db: Session = Depends(get_db),
                       current_user: models.User = Depends(get_current_user)):
    user = service.set_user_active(db, user_id=user_id, activo=activo)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# --- Eliminar usuario ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_user)):
    success = service.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"detail": "Usuario eliminado"}
