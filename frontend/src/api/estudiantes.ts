import type { EstudianteOut, NewEstudiante, UpdateEstudiante } from "../types/estudiante";
import { authFetch } from "./authFetch";

export const fetchEstudiantesApi = async (): Promise<EstudianteOut[]> => {
  const data = await authFetch("/estudiantes/");
  return data;
};

export const createEstudianteApi = async (est: NewEstudiante): Promise<EstudianteOut> => {
  return authFetch("/estudiantes/", {
    method: "POST",
    body: JSON.stringify(est),
  });
};

export const updateEstudianteApi = async (id: number, est: UpdateEstudiante): Promise<EstudianteOut> => {
  return authFetch(`/estudiantes/${id}`, {
    method: "PUT",
    body: JSON.stringify(est),
  });
};

export const deleteEstudianteApi = async (id: number): Promise<void> => {
  return authFetch(`/estudiantes/${id}`, {
    method: "DELETE",
  });
};

export const toggleEstudianteStatusApi = async (id: number, activo: boolean): Promise<EstudianteOut> => {
  return authFetch(`/estudiantes/${id}/status?activo=${activo}`, {
    method: "PATCH",
  });
};
