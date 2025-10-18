from datetime import datetime
from zoneinfo import ZoneInfo

BOLIVIA_TZ = ZoneInfo("America/La_Paz")

def now_bolivia() -> datetime:
    """Devuelve fecha y hora actual en Bolivia"""
    return datetime.now(BOLIVIA_TZ)

def today_bolivia() -> datetime.date:
    """Devuelve solo la fecha actual en Bolivia"""
    return now_bolivia().date()
