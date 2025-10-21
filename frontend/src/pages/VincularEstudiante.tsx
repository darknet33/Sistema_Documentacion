// src/pages/VincularEstudiante.tsx
import { LoadingScreen, VincularEstudianteTable } from "../components";
import type { EstudianteOut } from "../types/estudiante";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";
import { PageLayout } from "../layout/PageLayout";
import type { PadresEstudiantesCreate } from "../types/padresEstudiantes";
import { useNotification } from "../context/NotificationContext";

export default function VincularEstudiante() {
  const { estudiantes, loading: loadingEst } = useEstudiantes();
  const { relaciones, addRelacion, deleteRelacion } = usePadreEstudiante();
  const { setNotification } = useNotification();

  const handleVincular = async (data: PadresEstudiantesCreate) => {
    try {
      await addRelacion(data);
      setNotification({ message: "Solicitud enviada correctamente.", type: "success" });
    } catch (err: any) {
      console.error("Error al vincular estudiante:", err);
      setNotification({ message: err?.message || "Error al vincular estudiante.", type: "error" });
    }
  };

  const handleDesvincular = async (estudiante: EstudianteOut) => {
    try {
      const relacion = relaciones.find((r) => r.estudiante.id === estudiante.id);
      if (relacion) {
        await deleteRelacion(relacion.id);
        setNotification({ message: "Cancelacion de Solicitud.", type: "success" });
      }
    } catch (err: any) {
      console.error("Error al desvincular estudiante:", err);
      setNotification({ message: err?.message || "Error al desvincular estudiante.", type: "error" });
    }
  };

  const estudiantesConRelacion = new Set(relaciones.map(r => r.estudiante.id));
  const estudiantesDisponibles = estudiantes.filter(est => !estudiantesConRelacion.has(est.id));

  return (
    <PageLayout title="Solicitud Padres con Estudiantes">
      {loadingEst ? (
        <LoadingScreen/>
      ) : (
        <VincularEstudianteTable
          onVincular={handleVincular}
          onDesvincular={handleDesvincular}
          estudiantes={estudiantesDisponibles}
        />
      )}
    </PageLayout>
  );
}
