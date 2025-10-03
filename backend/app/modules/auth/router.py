# src/app/modules/auth/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated

from app.modules.auth import schemas
from app.modules.users import models, crud

from app.core.database import get_db
from app.utils.auth import (
    verify_password, 
    create_access_token, 
    create_refresh_token,
    decode_token,
    get_current_user,
)

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

@router.post("/login", response_model=schemas.LoginSuccess)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login de usuario y generación de JWT."""
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas."
    )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo."
        )

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    return schemas.LoginSuccess(
        access_token=access_token,
        refresh_token=refresh_token,
        user_data=schemas.UserOut.model_validate(user)
    )

@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh_token_endpoint(refresh_token: Annotated[str, Body(embed=True)], db: Session = Depends(get_db)):
    """Genera un nuevo access token usando el refresh token."""
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Se requiere token de refresco.")
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token de refresco inválido.")
    user = crud.get_user_by_email(db, email=email)
    if not user or not user.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inactivo o no encontrado.")
    new_access_token = create_access_token(data={"sub": user.email})
    return schemas.TokenResponse(access_token=new_access_token, refresh_token=refresh_token)

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: models.User = Depends(get_current_user)):
    """Logout simulado (JWT stateless)."""
    return {"message": "Sesión cerrada. Elimina los tokens locales."}

@router.get("/me", response_model=schemas.UserOut)
def get_current_user_data(current_user: models.User = Depends(get_current_user)):
    """Obtiene información del usuario logueado."""
    return schemas.UserOut.model_validate(current_user)
