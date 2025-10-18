from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.service import get_current_user
from . import service, schemas
from fastapi import UploadFile, File, Form
from app.utils.files import save_uploaded_file, delete_file
from app.utils.datetime import today_bolivia
from typing import Optional
from datetime import date


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

# --- Listar documentos de todos los estudiantes ---
@router.get("/", response_model=list[schemas.DocumentoEstudianteOut])
def listar_Docuentos_estudiantes(skip: int = Query(0), limit: int = Query(100), db: Session = Depends(get_db)):
    return service.get_all_documento_estudiante(db, skip=skip, limit=limit)

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
    url_documento = save_uploaded_file(archivo, subfolder="documentos", prefix=f"{estudiante_id}_{catalogo_documento_id}")

    nuevo_doc = schemas.DocumentoEstudianteCreate(
        estudiante_id=estudiante_id,
        catalogo_documento_id=catalogo_documento_id,
        entregado=True,
        fecha_entrega=today_bolivia(),
        archivo_digital=url_documento
    )

    return service.create_documento_estudiante(db, nuevo_doc)

# --- Eliminar documento ---
@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(doc_id: int, db: Session = Depends(get_db)):
    doc = get_doc_or_404(db, doc_id)
    
    # Eliminar archivo del disco
    delete_file(doc.archivo_digital)

    service.delete_documento_estudiante(db, doc_id)
    return {"detail": "Documento eliminado correctamente"}

# --- Aprobar documento ---
@router.patch("/aprobar/{doc_id}", response_model=schemas.DocumentoEstudianteOut)
def aprobar_documento(
    doc_id: int,
    fecha_vencimiento: Optional[date] = Query(None, description="Nueva fecha de vencimiento (opcional)"),
    db: Session = Depends(get_db)
):
    """
    Aprueba un documento:
    - Observación: "Recepcionado y Verificado"
    - Entregado: True
    - Si se envía fecha_vencimiento, se actualiza; si no, se mantiene.
    """
    return service.aprobar_documento(db, doc_id, nueva_fecha_vencimiento=fecha_vencimiento)


# --- Rechazar documento ---
@router.patch("/rechazar/{doc_id}", response_model=schemas.DocumentoEstudianteOut)
def rechazar_documento(doc_id: int, observacion: str = Form(...), db: Session = Depends(get_db)):
    """
    Rechaza un documento:
    - Observación: se envía desde el frontend
    - Entregado: False
    """
    return service.rechazar_documento(db, doc_id, observacion)


# --- Reenviar documento ---
@router.patch("/reenviar/{doc_id}", response_model=schemas.DocumentoEstudianteOut)
async def reenviar_documento(
    doc_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    doc = get_doc_or_404(db, doc_id)
    # Eliminar archivo del disco
    delete_file(doc.archivo_digital)
    """
    Reenvía un documento:
    - Recibe archivo nuevo
    - Entregado: True
    - Observación: "Enviado por Confirmar"
    - Fecha de vencimiento: None
    - Fecha de entrega: hoy Bolivia
    """
    # Guardar archivo nuevo
    url_documento = save_uploaded_file(archivo, subfolder="documentos", prefix=f"{doc_id}")
    
    return service.reenviar_documento(db, doc_id, archivo_url=url_documento)


