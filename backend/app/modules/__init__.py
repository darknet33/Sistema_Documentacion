# app/modules/__init__.py
from fastapi import APIRouter
import importlib
import pkgutil
import traceback

router = APIRouter()

# Iterar sobre todos los submódulos (paquetes dentro de app.modules)
for _, module_name, is_pkg in pkgutil.iter_modules(__path__):
    if not is_pkg:
        continue  # Solo cargamos paquetes (directorios con __init__.py)

    try:
        # Importa el módulo router del paquete
        mod = importlib.import_module(f".{module_name}.router", package=__name__)

        # Si tiene un router definido, lo incluimos
        if hasattr(mod, "router"):
            router.include_router(
                mod.router,
                prefix=f"/api/v1/{module_name}"
            )
            print(f"✅ Router cargado: {module_name}")
        else:
            print(f"⚠️  Módulo '{module_name}' no tiene router definido.")
    except Exception as e:
        print(f"❌ Error al cargar el módulo '{module_name}': {e}")
        traceback.print_exc()
