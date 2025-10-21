import { PadresEstudiantesTable } from "../components";
import { PageLayout } from "../layout/PageLayout";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";

export default function RelacionesPendientes() {
  const { relaciones, loading, aceptarRelacion, rechazarRelacion, reload } = usePadreEstudiante();
  const { setNotification } = useNotification();

  const [observacion, setObservacion] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const pendientes = relaciones.filter((r) => r.observacion === "Solicitado" && !r.estado);

  const handleAceptar = async (id: number) => {
    try {
      await aceptarRelacion(id);
      setNotification({ message: "Relación aceptada correctamente.", type: "success" });
      reload();
    } catch (err: any) {
      console.error("Error al aceptar relación:", err);
      setNotification({ message: err?.message || "Error al aceptar la relación.", type: "error" });
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      await rechazarRelacion(id, observacion);
      setSelectedId(null);
      setObservacion("");
      setNotification({ message: "Relación rechazada correctamente.", type: "success" });
      reload();
    } catch (err: any) {
      console.error("Error al rechazar relación:", err);
      setNotification({ message: err?.message || "Error al rechazar la relación.", type: "error" });
    }
  };

  return (
    <PageLayout title="Solicitud de Vinculación">
      {loading ? (
        <p className="text-gray-600">Cargando solicitudes...</p>
      ) : pendientes.length === 0 ? (
        <p className="text-gray-600">No hay solicitudes pendientes.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
          <PadresEstudiantesTable
            pendientes={pendientes}
            selectedId={selectedId}
            observacion={observacion}
            setSelectedId={setSelectedId}
            setObservacion={setObservacion}
            handleAceptar={handleAceptar}
            handleRechazar={handleRechazar}
          />
        </div>
      )}
    </PageLayout>
  );
}
