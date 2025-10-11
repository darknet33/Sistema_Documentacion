import { authFetch } from "./authFetch";
import type { DocumentoRequeridoOut, DocumentoRequeridoCreate } from "../types/docRequerido";

export const fetchDocsByCursoApi = async (cursoId: number): Promise<DocumentoRequeridoOut[]> => {
  return authFetch(`/documentos_requeridos/curso/${cursoId}`);
};

export const createDocReqApi = async (data: DocumentoRequeridoCreate): Promise<DocumentoRequeridoOut> => {
  return authFetch(`/documentos_requeridos/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteDocReqApi = async (id: number): Promise<void> => {
  return authFetch(`/documentos_requeridos/${id}`, {
    method: "DELETE",
  });
};
