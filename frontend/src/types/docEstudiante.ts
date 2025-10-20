import type { DocumentoRequeridoOut } from "./docRequerido";
import type { EstudianteOut } from "./estudiante";
import type { DocumentOut } from "./document";
export interface DocumentoEstudianteOut{
    id: number; // id del registro en documentos_estudiantes
    estudiante_id: number;
    catalogo_documento_id: number;
    entregado: boolean;
    fecha_entrega?: string | null;
    archivo_digital?: string | null;
    fecha_vencimiento?: string | null;
    observaciones?: string | null;
    estudiante: EstudianteOut | null;
    catalogo_documento: DocumentOut| null;
    estadoVencimiento?: string | null
}

export interface DocumentoEstudianteCreate{
    estudiante_id: number;
    catalogo_documento_id: number;
    entregado: boolean;
    fecha_entrega?: string | null;
    archivo_digital?: string | null;
}

export interface DocumentoEstudianteUpdate{
    entregado?: boolean;
    fecha_entrega?: string | null;
    archivo_digital?: string | null;
    fecha_vencimiento?: string | null;
    observaciones?: string | null;
}

export interface DocumentoCombinado extends DocumentoRequeridoOut {
  entregado: boolean;
  documento?: DocumentoEstudianteOut | null;
}