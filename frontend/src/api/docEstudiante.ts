import type {
    DocumentoEstudianteOut,
    DocumentoEstudianteUpdate
} from '../types/docEstudiante';

import { authFetch } from './authFetch';


export const fetchDocumentosEstudiantesByEstudianteApi = async (estudianteId: number): Promise<DocumentoEstudianteOut[]> => {
    const data = await authFetch(`/documentos_estudiante/estudiante/${estudianteId}`);
    return data
}

export const createDocumentoEstudianteApi = async (formData: FormData): Promise<DocumentoEstudianteOut> => {
    return authFetch('/documentos_estudiante/', {
        method: 'POST',
        body: formData
    });
};


export const updateDocumentoEstudianteApi = async (id: number, updates: DocumentoEstudianteUpdate): Promise<DocumentoEstudianteOut> => {
    return authFetch(`/documentos_estudiante/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

export const deleteDocumentoEstudianteApi = async (id: number): Promise<DocumentoEstudianteOut> => {
    return authFetch(`/documentos_estudiante/${id}`, {
        method: 'DELETE'
    });
}