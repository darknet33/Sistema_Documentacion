// src/api/docEstudiante.ts
import type {
  DocumentoEstudianteOut,
} from "../types/docEstudiante";
import { authFetch } from "./authFetch";

// 🔹 Obtener todos los documentos
export const fetchDocumentosEstudiantesApi = async (): Promise<DocumentoEstudianteOut[]> => {
  const data = await authFetch("/documentos_estudiante/");
  return data;
};

// 🔹 Obtener documentos por estudiante
export const fetchDocumentosEstudiantesByEstudianteApi = async (
  estudianteId: number
): Promise<DocumentoEstudianteOut[]> => {
  const data = await authFetch(`/documentos_estudiante/estudiante/${estudianteId}`);
  return data;
};

// 🔹 Crear (entregar) documento
export const createDocumentoEstudianteApi = async (
  formData: FormData
): Promise<DocumentoEstudianteOut> => {
  return authFetch("/documentos_estudiante/", {
    method: "POST",
    body: formData,
  });
};

// 🔹 Eliminar documento
export const deleteDocumentoEstudianteApi = async (
  id: number
): Promise<{ detail: string }> => {
  return authFetch(`/documentos_estudiante/${id}`, {
    method: "DELETE",
  });
};

// ✅ Aprobar documento
export const aprobarDocumentoApi = async (
  id: number,
  fechaVencimiento?: string // formato 'YYYY-MM-DD'
): Promise<DocumentoEstudianteOut> => {
  const url = fechaVencimiento
    ? `/documentos_estudiante/aprobar/${id}?fecha_vencimiento=${fechaVencimiento}`
    : `/documentos_estudiante/aprobar/${id}`;

  return authFetch(url, { method: "PATCH" });
};


// ❌ Rechazar documento
export const rechazarDocumentoApi = async (
  id: number,
  observacion: string
): Promise<DocumentoEstudianteOut> => {
  const formData = new FormData();
  formData.append("observacion", observacion);

  return authFetch(`/documentos_estudiante/rechazar/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

// 🔁 Reenviar documento
export const reenviarDocumentoApi = async (
  id: number,
  archivo: File
): Promise<DocumentoEstudianteOut> => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return authFetch(`/documentos_estudiante/reenviar/${id}`, {
    method: "PATCH",
    body: formData,
  });
};
