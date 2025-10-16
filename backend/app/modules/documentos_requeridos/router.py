from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.documentos_requeridos import service, schemas
from app.modules.auth.service import get_current_user
from app.modules.usuarios.models import User

router = APIRouter(prefix="/documentos_requeridos", tags=["Documentos Requeridos"])


@router.get("/curso/{curso_id}", response_model=list[schemas.DocumentoRequeridoOut])
def get_by_curso(curso_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_by_curso(db, curso_id)


@router.post("/", response_model=schemas.DocumentoRequeridoOut)
def create(req: schemas.DocumentoRequeridoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create_documento_requerido(db, req)


@router.delete("/{id}", status_code=204)
def delete(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.delete_documento_requerido(db, id)
