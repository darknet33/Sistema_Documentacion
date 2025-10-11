import { useState, useEffect } from "react";
import type { EstudianteOut, NewEstudiante, UpdateEstudiante } from "../types/estudiante";
import {
  fetchEstudiantesApi,
  createEstudianteApi,
  updateEstudianteApi,
  deleteEstudianteApi,
  toggleEstudianteStatusApi,
} from "../api/estudiantes";

export const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState<EstudianteOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEstudiantes = async () => {
    setLoading(true);
    try {
      const data = await fetchEstudiantesApi();
      setEstudiantes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const addEstudiante = async (est: NewEstudiante) => {
    const newEst = await createEstudianteApi(est);
    setEstudiantes((prev) => [...prev, { ...newEst }]);
    return newEst;
  };

  const updateEstudiante = async (id: number, est: UpdateEstudiante) => {
    const updated = await updateEstudianteApi(id, est);
    setEstudiantes((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const toggleStatus = async (id: number, activo: boolean) => {
    const updated = await toggleEstudianteStatusApi(id, activo);
    setEstudiantes((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEstudiante = async (id: number) => {
    await deleteEstudianteApi(id);
    setEstudiantes((prev) => prev.filter((e) => e.id !== id));
  };

  useEffect(() => {
    loadEstudiantes();
  }, []);

  return {
    estudiantes,
    loading,
    error,
    addEstudiante,
    updateEstudiante,
    toggleStatus,
    deleteEstudiante,
    reload: loadEstudiantes,
  };
};
