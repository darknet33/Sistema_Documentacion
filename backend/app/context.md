# 🧠 Contexto de Desarrollo — FastAPI Modular Backend

Este proyecto usa **FastAPI + SQLAlchemy**, con una arquitectura **modular** donde cada tabla SQL se convierte en un módulo dentro de `app/modules/`.

El objetivo de este documento es guiar a los **agentes generadores de código** sobre cómo deben construir automáticamente los archivos a partir de un SQL (`CREATE TABLE ...`).

---

## 📁 Estructura General del Proyecto

app/
├── core/
│ ├── database.py # Configuración de SQLAlchemy Base y get_db
│ └── config.py # Variables de entorno y configuración
├── utils/
│ ├── auth.py # Autenticación, get_current_user()
│ └── datetime.py # Función now_bolivia()
├── modules/
│ └── <modulo>/
│ ├── models.py
│ ├── schemas.py
│ ├── service.py
│ └── router.py
└── main.py

yaml
Copiar código

---

## ⚙️ Reglas para la Generación Automática

Cuando se entrega un **SQL (CREATE TABLE ...)**, el agente debe generar automáticamente los siguientes 4 archivos dentro de `app/modules/<nombre_tabla>/`.

---

### 1️⃣ `models.py`

#### 📄 Descripción
Define el modelo SQLAlchemy que representa la tabla.

#### 📚 Importaciones requeridas
```python
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia
🧩 Reglas
El nombre de la clase será en PascalCase (ejemplo: documentos_requeridos → DocumentoRequerido).

Si el SQL contiene columnas tipo timestamp o datetime, usar:

python
Copiar código
fecha_creacion = Column(DateTime(timezone=True), default=now_bolivia)
Si existe una columna de estado lógico, usar:

python
Copiar código
activo = Column(Boolean, default=True, nullable=False)
Las relaciones (FOREIGN KEY) deben incluir relationship() y back_populates.

🧱 Ejemplo
python
Copiar código
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.datetime import now_bolivia

class Curso(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255))
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), default=now_bolivia)
2️⃣ schemas.py
📄 Descripción
Define los modelos Pydantic usados para validación y respuesta en la API.

📚 Importaciones requeridas
python
Copiar código
from pydantic import BaseModel
from datetime import date, datetime
🧩 Clases esperadas
<Entidad>Base

<Entidad>Create

<Entidad>Update

<Entidad>Out

🧱 Ejemplo
python
Copiar código
from pydantic import BaseModel
from datetime import datetime

class CursoBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class CursoCreate(CursoBase):
    pass

class CursoUpdate(CursoBase):
    activo: bool | None = None

class CursoOut(CursoBase):
    id: int
    activo: bool
    fecha_creacion: datetime

    class Config:
        orm_mode = True
3️⃣ service.py
📄 Descripción
Contiene las funciones CRUD que interactúan con la base de datos mediante SQLAlchemy.

📚 Importaciones requeridas
python
Copiar código
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.modules.<modulo> import models, schemas
🧩 Funciones esperadas
python
Copiar código
def get_all(db: Session):
def get_by_id(db: Session, id: int):
def create(db: Session, obj_in: schemas.<Entidad>Create):
def update(db: Session, id: int, obj_in: schemas.<Entidad>Update):
def delete(db: Session, id: int):
🧱 Ejemplo
python
Copiar código
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.modules.cursos import models, schemas

def get_all(db: Session):
    return db.query(models.Curso).all()

def get_by_id(db: Session, id: int):
    obj = db.query(models.Curso).filter(models.Curso.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return obj

def create(db: Session, obj_in: schemas.CursoCreate):
    db_obj = models.Curso(**obj_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, id: int, obj_in: schemas.CursoUpdate):
    db_obj = get_by_id(db, id)
    for key, value in obj_in.dict(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, id: int):
    db_obj = get_by_id(db, id)
    db.delete(db_obj)
    db.commit()
    return {"detail": "Eliminado correctamente"}
4️⃣ router.py
📄 Descripción
Define los endpoints de la API para el módulo.
Todos los endpoints están protegidos con autenticación (current_user).

📚 Importaciones requeridas
python
Copiar código
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils.auth import get_current_user
from app.modules.users.models import User
from app.modules.<modulo> import service, schemas
🧩 Reglas
Prefijo dinámico según el módulo:

python
Copiar código
router = APIRouter(prefix="/<modulo>", tags=["<Nombre legible>"])
Todos los endpoints incluyen current_user: User = Depends(get_current_user).

🧱 Ejemplo
python
Copiar código
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils.auth import get_current_user
from app.modules.users.models import User
from app.modules.cursos import service, schemas

router = APIRouter(prefix="/cursos", tags=["Cursos"])

@router.get("/", response_model=list[schemas.CursoOut])
def get_all(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_all(db)

@router.get("/{id}", response_model=schemas.CursoOut)
def get_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_by_id(db, id)

@router.post("/", response_model=schemas.CursoOut)
def create(obj_in: schemas.CursoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.create(db, obj_in)

@router.put("/{id}", response_model=schemas.CursoOut)
def update(id: int, obj_in: schemas.CursoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.update(db, id, obj_in)

@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.delete(db, id)
📜 Convenciones Globales
Concepto	Regla
Nombres de módulos	minúsculas, con guion bajo (documentos_requeridos)
Nombres de clases	PascalCase (DocumentoRequerido)
Campos de fecha	Usan now_bolivia
Relaciones	relationship() con back_populates
Autenticación	Todos los endpoints usan current_user
Base de datos	app.core.database.Base
Tipado	PEP8 + Tipado estricto (str, int, bool, datetime)

🧩 Ejemplo Completo
SQL de entrada:
sql
Copiar código
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);
Archivos generados:
models.py → Clase Curso

schemas.py → Esquemas Pydantic (CursoBase, CursoCreate, CursoUpdate, CursoOut)

service.py → CRUD con SQLAlchemy

router.py → Endpoints REST /cursos protegidos con autenticación

✅ Resumen para Agentes:

Cada vez que se reciba un CREATE TABLE, debes generar los 4 archivos descritos arriba dentro de un módulo con el mismo nombre de la tabla, siguiendo todas las convenciones de este documento.