from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.modules.users import schemas
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import Annotated

# --- Configuración de Seguridad ---

# Usamos una clave secreta muy simple para el ejemplo. 
# ¡En producción, debe ser una cadena muy larga generada aleatoriamente!
SECRET_KEY = "tu_clave_super_secreta_y_larga"
ALGORITHM = "HS256"

# Define el contexto para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define el esquema de seguridad OAuth2 para FastAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# --- Funciones de Password Hashing (Corrección Bcrypt) ---

def hash_password(password: str) -> str:
    """Hashea la contraseña, truncando a 72 caracteres para evitar error Bcrypt."""
    # ¡ESTA LÍNEA ES CRÍTICA!
    truncated_password = password[:72] 
    return pwd_context.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica la contraseña, truncando la contraseña plana antes de verificar."""
    truncated_password = plain_password[:72]
    return pwd_context.verify(truncated_password, hashed_password)

# --- Funciones de Token JWT ---

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Crea un token de acceso JWT (corta duración)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Token de Acceso: 15 minutos
        expire = datetime.now(timezone.utc) + timedelta(minutes=30) 
        
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Crea un token de refresco JWT (larga duración)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Token de Acceso: 15 minutos
        expire = datetime.now(timezone.utc) + timedelta(minutes=30) 
        
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decodifica el token y maneja errores de JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

# --- Dependencia para Proteger Rutas ---

# Simulación de la obtención de usuario (debería consultar la DB en una app real)
from app.modules.users.service import get_user_by_email as get_user_from_db

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> schemas.UserOut:
    """Verifica el token de acceso y retorna el objeto UserOut."""
    payload = decode_token(token)
    
    # 1. Verificar tipo de token
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tipo de token incorrecto.")

    # 2. Obtener el subject (email)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token sin identificación de usuario.")
    
    # 3. Buscar usuario en DB
    user = get_user_from_db(db, email=email)
    
    if user is None or not user.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inactivo o no encontrado.")
    
    # Retornar el esquema Pydantic para el usuario actual
    return schemas.UserOut.model_validate(user)
