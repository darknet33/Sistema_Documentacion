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

export interface DocEstudianteContextType {
    documentosEntregados: DocumentoEstudianteOut[];
    documentosFiltrados: {
        documentosPorConfirmar: DocumentoEstudianteOut[];
        documentosAprobados: DocumentoEstudianteOut[];
        documentosPorVencer: DocumentoEstudianteOut[];
    };
    aprobarDocumento: (id: number, fechaVencimiento?: string) => Promise<DocumentoEstudianteOut>;
    rechazarDocumento: (id: number, observacion: string) => Promise<DocumentoEstudianteOut>;
    notificarDocumentoVencido: (id: number, observacion: string) => Promise<DocumentoEstudianteOut>;
    reload: () => Promise<void>;
    loading: boolean;
    error: string | null;
}