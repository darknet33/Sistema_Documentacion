from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.service import get_current_user
from app.modules.usuarios.models import User
from . import service, schemas
from fastapi import UploadFile, File, Form

router = APIRouter(
    prefix="/documentos_estudiante",
    tags=["Documentos Estudiante"],
    dependencies=[Depends(get_current_user)]  # Todos los endpoints requieren usuario autenticado
)

# --- Helper interno ---
def get_doc_or_404(db: Session, doc_id: int):
    doc = service.get_documento_estudiante_by_id(db, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return doc


# --- Listar documentos de un estudiante ---
@router.get("/estudiante/{estudiante_id}", response_model=list[schemas.DocumentoEstudianteOut])
def get_by_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return service.get_by_estudiante(db, estudiante_id)

# --- Crear documento ---
@router.post("/", response_model=schemas.DocumentoEstudianteOut, status_code=201)
async def create_documento(
    estudiante_id: int = Form(...),
    catalogo_documento_id: int = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    import os, shutil
    from datetime import datetime

    # Carpeta para guardar archivos
    UPLOAD_DIR = "uploads/documentos_estudiante"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Nombre único para evitar colisiones
    timestamp = int(datetime.utcnow().timestamp() * 1000)
    filename = f"{estudiante_id}_{catalogo_documento_id}_{timestamp}_{archivo.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(archivo.file, f)

    # Guardar en DB
    url_documento = f"/static/documentos/{filename}"  # Luego servir la carpeta como estática
    nuevo_doc = schemas.DocumentoEstudianteCreate(
        estudiante_id=estudiante_id,
        catalogo_documento_id=catalogo_documento_id,
        entregado=True,
        fecha_entrega=datetime.utcnow().date(),
        archivo_digital=url_documento
    )

    return service.create_documento_estudiante(db, nuevo_doc)


# --- Actualizar documento ---
@router.put("/{doc_id}", response_model=schemas.DocumentoEstudianteOut)
def update_documento(doc_id: int, req: schemas.DocumentoEstudianteUpdate, db: Session = Depends(get_db)):
    get_doc_or_404(db, doc_id)
    return service.update_documento_estudiante(db, doc_id, req)


# --- Eliminar documento ---
@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(doc_id: int, db: Session = Depends(get_db)):
    get_doc_or_404(db, doc_id)
    service.delete_documento_estudiante(db, doc_id)
    return {"detail": "Documento eliminado correctamente"}
