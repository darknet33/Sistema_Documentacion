from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9+

# Zona horaria de Bolivia
BOLIVIA_TZ = ZoneInfo("America/La_Paz")

def now_bolivia() -> datetime:
    """
    Devuelve la fecha y hora actual en Bolivia.
    Se puede usar como default o onupdate en SQLAlchemy.
    """
    return datetime.now(BOLIVIA_TZ)
