# app/modules/auth/service.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict

from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.modules.usuarios import schemas, service as user_service

# ==========================================================
# ⚙️ CONFIGURACIÓN
# ==========================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_EXPIRE = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
REFRESH_EXPIRE = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)


# ==========================================================
# 🧾 TOKENS JWT
# ==========================================================
def create_access_token(data: Dict[str, Any]) -> str:
    payload = data.copy()
    payload.update({
        "exp": datetime.now(timezone.utc) + ACCESS_EXPIRE,
        "type": "access"
    })
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: Dict[str, Any]) -> str:
    payload = data.copy()
    payload.update({
        "exp": datetime.now(timezone.utc) + REFRESH_EXPIRE,
        "type": "refresh"
    })
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ==========================================================
# 🧍 USUARIO ACTUAL
# ==========================================================
def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> schemas.UserOut:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token no provisto")

    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tipo de token incorrecto")

    email = payload.get("sub")
    user = user_service.authenticate_user(db, email=email)
    return schemas.UserOut.model_validate(user)
