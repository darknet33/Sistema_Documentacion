import { VincularEstudianteTable } from "../components";
import type { EstudianteOut } from "../types/estudiante";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";
import { PageLayout } from "../layout/PageLayout";
import type { PadresEstudiantesCreate } from "../types/padresEstudiantes";

export default function VincularEstudiante() {

  // 🔹 Cargar estudiantes
  const { estudiantes, loading: loadingEst } = useEstudiantes();

  // 🔹 Cargar relaciones padre-estudiante según perfil
  const {
    relaciones,
    addRelacion,
    deleteRelacion,
    reload: reloadRelaciones,
  } = usePadreEstudiante();

  // 🔹 Vincular estudiante con perfil (ya viene completo desde el formulario)
  const handleVincular = async (data: PadresEstudiantesCreate) => {
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


  // 🔹 Crear un Set con todos los IDs de estudiantes que ya tienen alguna relación
  const estudiantesConRelacion = new Set(relaciones.map(r => r.estudiante.id));

  // 🔹 Filtrar los estudiantes que NO están en ese Set → estudiantes libres
  const estudiantesDisponibles = estudiantes.filter(est => !estudiantesConRelacion.has(est.id));


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
