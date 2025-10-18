# app/utils/files.py
import os
import shutil
from datetime import datetime
from fastapi import UploadFile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # /backend/app

def save_uploaded_file(
    archivo: UploadFile,
    subfolder: str = "documentos",
    prefix: str = "",
    make_numeric_name: bool = True
) -> str:
    """
    Guarda un archivo dentro de app/static/<subfolder> y devuelve la URL para la DB.
    
    - archivo: UploadFile recibido por FastAPI
    - subfolder: carpeta dentro de static
    - prefix: se puede usar estudiante_id u otro prefijo
    - make_numeric_name: si True genera nombre numérico único con timestamp
    """
    STATIC_DIR = os.path.join(BASE_DIR, "static")
    UPLOAD_DIR = os.path.join(STATIC_DIR, subfolder)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Obtener extensión
    file_ext = os.path.splitext(archivo.filename)[1]

    if make_numeric_name:
        timestamp = int(datetime.utcnow().timestamp() * 1000)
        filename = f"{prefix}_{timestamp}{file_ext}" if prefix else f"{timestamp}{file_ext}"
    else:
        filename = archivo.filename

    file_path = os.path.join(UPLOAD_DIR, filename)

    with archivo.file as src, open(file_path, "wb") as dst:
        shutil.copyfileobj(src, dst)

    return f"/static/{subfolder}/{filename}"

def delete_file(file_url: str):
    """
    Elimina un archivo a partir de su URL en la DB.
    file_url: '/static/documentos/archivo.pdf'
    """
    if not file_url:
        return
    file_path = os.path.join(BASE_DIR, file_url.lstrip("/"))  # convierte URL a path
    if os.path.exists(file_path):
        os.remove(file_path)

