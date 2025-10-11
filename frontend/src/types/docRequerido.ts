// src/types/docRequerido.ts

// Documento requerido que viene desde el backend
export interface DocumentoRequeridoOut {
  id: number; // id del registro en documentos_requeridos
  catalogo_documento_id: number;
  curso_id: number;
  fecha_limite?: string | null;
}

// Para crear un documento requerido
export interface DocumentoRequeridoCreate {
  catalogo_documento_id: number;
  curso_id: number;
  fecha_limite?: string | null;
}
