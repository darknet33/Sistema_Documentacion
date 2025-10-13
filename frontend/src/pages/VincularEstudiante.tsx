import { Sidebar, VincularEstudianteTable } from "../components";
import type { EstudianteOut } from "../types/estudiante";
import { useAuth } from "../context/AuthContext";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";

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
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Panel de Vincular Estudiante
        </h1>

        {loadingEst ? (
          <p className="text-gray-600">Cargando estudiantes...</p>
        ) : (
          <VincularEstudianteTable
            onVincular={handleVincular}
            onDesvincular={handleDesvincular}
            estudiantes={estudiantesDisponibles}
          />
        )}
      </main>
    </div>
  );
}
