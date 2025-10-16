# app/modules/auth/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated

from app.modules.auth import schemas
from app.modules.usuarios import service as user_service
from app.core.database import get_db
from app.modules.auth.service import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=schemas.LoginSuccess)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login de usuario y generación de JWT."""
    user = user_service.authenticate_user(db, form_data.username, form_data.password)

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    return schemas.LoginSuccess(
        access_token=access_token,
        refresh_token=refresh_token,
        user_data=schemas.UserOut.model_validate(user)
    )


@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh_token_endpoint(
    refresh_token: Annotated[str, Body(embed=True)],
    db: Session = Depends(get_db)
):
    """Genera un nuevo access token usando el refresh token."""
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Se requiere token de refresco.")

    email = payload.get("sub")
    user = user_service.authenticate_user(db, email=email)

    new_access_token = create_access_token({"sub": user.email})
    return schemas.TokenResponse(access_token=new_access_token, refresh_token=refresh_token)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user=Depends(get_current_user)):
    """Logout simulado (JWT stateless)."""
    return {"message": "Sesión cerrada. Elimina los tokens locales."}


@router.get("/me", response_model=schemas.UserOut)
def get_current_user_data(current_user=Depends(get_current_user)):
    """Obtiene información del usuario logueado."""
    return schemas.UserOut.model_validate(current_user)
