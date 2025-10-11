import type { DocumentOut, NewDocument, UpdateDocument } from "../types/document";
import { authFetch } from "./authFetch";

// Obtener todos los documentos
export const fetchDocumentsApi = async (): Promise<DocumentOut[]> => {
  return authFetch("/cat_documentos/");
};

// Crear documento
export const createDocumentApi = async (document: NewDocument): Promise<DocumentOut> => {
  return authFetch("/cat_documentos/", {
    method: "POST",
    body: JSON.stringify(document),
  });
};

// Actualizar documento
export const updateDocumentApi = async (id: number, document: UpdateDocument): Promise<DocumentOut> => {
  return authFetch(`/cat_documentos/${id}`, {
    method: "PUT",
    body: JSON.stringify(document),
  });
};

// Eliminar documento
export const deleteDocumentApi = async (id: number): Promise<void> => {
  return authFetch(`/cat_documentos/${id}`, {
    method: "DELETE",
  });
};

// Cambiar estado (activo/inactivo)
export const toggleDocumentStatusApi = async (id: number, activo: boolean): Promise<DocumentOut> => {
  return authFetch(`/cat_documentos/${id}/status?activo=${activo}`, {
    method: "PATCH",
  });
};

// Cambiar si es obligatorio o no
export const toggleDocumentObligatorioApi = async (id: number, es_obligatorio: boolean): Promise<DocumentOut> => {
  return authFetch(`/cat_documentos/${id}/obligatorio?es_obligatorio=${es_obligatorio}`, {
    method: "PATCH",
  });
};
