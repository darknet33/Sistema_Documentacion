import type { DocumentoRequeridoOut } from "./docRequerido";

export interface DocumentoEstudianteOut{
    id: number; // id del registro en documentos_estudiantes
    estudiante_id: number;
    catalogo_documento_id: number;
    entregado: boolean;
    fecha_entrega?: string | null;
    url_documento?: string | null;
}

export interface DocumentoEstudianteCreate{
    estudiante_id: number;
    catalogo_documento_id: number;
    entregado: boolean;
    fecha_entrega?: string | null;
    url_documento?: string | null;
}

export interface DocumentoEstudianteUpdate{
    entregado?: boolean;
    fecha_entrega?: string | null;
    url_documento?: string | null;
}

export interface DocumentoCombinado extends DocumentoRequeridoOut {
  entregado: boolean;
  documento?: DocumentoEstudianteOut | null;
}