import { VincularEstudianteTable } from "../components";
import type { EstudianteOut } from "../types/estudiante";
import { useAuth } from "../context/AuthContext";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";
import { PageLayout } from "../layout/PageLayout";

export default function VincularEstudiante() {
  const { user } = useAuth();

  // 🔹 Cargar estudiantes
  const { estudiantes, loading: loadingEst } = useEstudiantes();

  // 🔹 Cargar relaciones padre-estudiante según perfil
  const {
    relaciones,
    addRelacion,
    deleteRelacion,
    reload: reloadRelaciones,
  } = usePadreEstudiante(user?.perfil?.id);

  // 🔹 Vincular estudiante con perfil (ya viene completo desde el formulario)
  const handleVincular = async (data: any) => {
    try {
      await addRelacion(data);
      reloadRelaciones();
    } catch (err) {
      console.error("Error al vincular estudiante:", err);
    }
  };

  // 🔹 Desvincular estudiante
  const handleDesvincular = async (estudiante: EstudianteOut) => {
    try {
      const relacion = relaciones.find((r) => r.estudiante.id === estudiante.id);
      if (relacion) {
        await deleteRelacion(relacion.id);
        reloadRelaciones();
      }
    } catch (err) {
      console.error("Error al desvincular estudiante:", err);
    }
  };

  // 🔹 Mostrar solo estudiantes que no están vinculados
  const estudiantesDisponibles = estudiantes.filter(
    (est) => !relaciones.some((rel) => rel.estudiante.id === est.id)
  );

  return (
    <PageLayout title="Solicitud Padres con Estudiantes">
      {loadingEst ? (
        <p className="text-gray-600">Cargando estudiantes...</p>
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
