import type {
  PadresEstudiantesOut,
  PadresEstudiantesCreate,
  PadresEstudiantesUpdate,
} from "../types/padresEstudiantes";
import { authFetch } from "./authFetch";

// 🔹 Listar todas las relaciones (GET /padres_estudiantes/)
export const fetchPadresEstudiantesApi = async (): Promise<PadresEstudiantesOut[]> => {
  const data = await authFetch("/padres_estudiantes/");
  return data;
};

// 🔹 Listar relaciones por perfil_id (GET /padres_estudiantes/{perfil_id})
export const fetchPadresEstudiantesByPerfilApi = async (
  perfilId: number
): Promise<PadresEstudiantesOut[]> => {
  const data = await authFetch(`/padres_estudiantes/${perfilId}`);
  return data;
};

// 🔹 Crear una nueva relación (POST /padres_estudiantes/)
export const createPadreEstudianteApi = async (
  relacion: PadresEstudiantesCreate
): Promise<PadresEstudiantesOut> => {
  return authFetch("/padres_estudiantes/", {
    method: "POST",
    body: JSON.stringify(relacion),
  });
};

// 🔹 Actualizar una relación (PUT /padres_estudiantes/{id})
export const updatePadreEstudianteApi = async (
  id: number,
  updates: PadresEstudiantesUpdate
): Promise<PadresEstudiantesOut> => {
  return authFetch(`/padres_estudiantes/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

// 🔹 Eliminar una relación (DELETE /padres_estudiantes/{id})
export const deletePadreEstudianteApi = async (
  id: number
): Promise<PadresEstudiantesOut> => {
  return authFetch(`/padres_estudiantes/${id}`, {
    method: "DELETE",
  });
};

// aceptar relación
export const aceptarRelacionApi = async (
  id: number
): Promise<PadresEstudiantesOut> => {
  return authFetch(`/padres_estudiantes/${id}/aceptar`, {
    method: "PATCH",
  });
};

// rechazar relación
export const rechazarRelacionApi = async (
  id: number,
  observacion?: string
): Promise<PadresEstudiantesOut> => {
  return authFetch(`/padres_estudiantes/${id}/rechazar`, {
    method: "PATCH",
    body: JSON.stringify({ observacion }),
  });
};