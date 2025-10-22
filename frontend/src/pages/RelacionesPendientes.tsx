import { PadresEstudiantesTable } from "../components";
import { PageLayout } from "../layout/PageLayout";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { usePadreEstudiante } from "../context/PadreEstudianteContext";

export default function RelacionesPendientes() {
  const { pendientes, loading, aceptarRelacion, rechazarRelacion } = usePadreEstudiante();
  const { setNotification } = useNotification();

  const [observacion, setObservacion] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleAceptar = async (id: number) => {
    try {
      await aceptarRelacion(id);
      setNotification({ message: "Relación aceptada correctamente.", type: "success" });
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
