import { useState, useEffect } from "react";
import type {
  PadresEstudiantesOut,
  PadresEstudiantesCreate,
  PadresEstudiantesUpdate,
} from "../types/padresEstudiantes";
import {
  fetchPadresEstudiantesApi,
  fetchPadresEstudiantesByPerfilApi,
  createPadreEstudianteApi,
  updatePadreEstudianteApi,
  deletePadreEstudianteApi,
  aceptarRelacionApi,
  rechazarRelacionApi,
} from "../api/padreEstudiantes";

export const usePadreEstudiante = (perfilId?: number) => {
  const [relaciones, setRelaciones] = useState<PadresEstudiantesOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar todas las relaciones o solo por perfil
  const loadRelaciones = async () => {
    setLoading(true);
    try {
      const data = perfilId
        ? await fetchPadresEstudiantesByPerfilApi(perfilId)
        : await fetchPadresEstudiantesApi();
      setRelaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nueva relación
  const addRelacion = async (rel: PadresEstudiantesCreate) => {
    const nueva = await createPadreEstudianteApi(rel);
    setRelaciones((prev) => [...prev, nueva]);
    return nueva;
  };

  // 🔹 Actualizar relación existente
  const updateRelacion = async (id: number, updates: PadresEstudiantesUpdate) => {
    const updated = await updatePadreEstudianteApi(id, updates);
    setRelaciones((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  // 🔹 Eliminar relación
  const deleteRelacion = async (id: number) => {
    await deletePadreEstudianteApi(id);
    setRelaciones((prev) => prev.filter((r) => r.id !== id));
  };

    // ✅ Nuevo: aceptar solicitud
  const aceptarRelacion = async (id: number) => {
    const updated = await aceptarRelacionApi(id);
    setRelaciones((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  // ✅ Nuevo: rechazar solicitud
  const rechazarRelacion = async (id: number, observacion?: string) => {
    const updated = await rechazarRelacionApi(id, observacion);
    setRelaciones((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  useEffect(() => {
    loadRelaciones();
  }, [perfilId]);

  return {
    relaciones,
    loading,
    error,
    addRelacion,
    updateRelacion,
    deleteRelacion,
    aceptarRelacion,
    rechazarRelacion,
    reload: loadRelaciones,
  };
};