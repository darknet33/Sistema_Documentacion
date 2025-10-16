# app/modules/__init__.py
from fastapi import APIRouter
import importlib
import pkgutil

router = APIRouter()

# Itera sobre todos los submódulos de app.modules
for _, module_name, is_pkg in pkgutil.iter_modules(__path__):
    if not is_pkg:
        continue  # Solo nos interesa paquetes que tengan routers

    try:
        mod = importlib.import_module(f".{module_name}.router", package=__name__)
        if hasattr(mod, "router"):
            router.include_router(mod.router, prefix="/api/v1")
    except ModuleNotFoundError:
        pass  # Si el módulo no tiene router, lo ignoramos
