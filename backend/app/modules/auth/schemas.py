from pydantic import BaseModel
from typing import Optional
from app.modules.usuarios.schemas import UserOut

# --- Esquemas de Autenticación JWT ---

class TokenResponse(BaseModel):
    """Respuesta al login o refresco de token."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class LoginSuccess(TokenResponse):
    """Datos que se envían al frontend tras login exitoso."""
    user_data: UserOut