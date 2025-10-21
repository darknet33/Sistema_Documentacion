import { useState } from "react";
import { EstudianteForm, EstudianteTable, LoadingScreen } from "../components";
import { useEstudiantes } from "../hooks/useEstudiantes";
import type { EstudianteOut, NewEstudiante, UpdateEstudiante } from "../types/estudiante";
import { PageLayout } from "../layout/PageLayout";
import { useNotification } from "../context/NotificationContext";

export default function Estudiantes() {
  const { estudiantes, loading, error, addEstudiante, updateEstudiante, toggleStatus, deleteEstudiante } = useEstudiantes();
  const { setNotification } = useNotification();

  const [showForm, setShowForm] = useState(false);
  const [editEstudiante, setEditEstudiante] = useState<EstudianteOut | null>(null);

  const handleCreate = () => {
    setEditEstudiante(null);
    setShowForm(true);
  };

  const handleEdit = (est: EstudianteOut) => {
    setEditEstudiante(est);
    setShowForm(true);
  };

  const handleSubmit = async (data: NewEstudiante | UpdateEstudiante) => {
    try {
      if (editEstudiante) {
        await updateEstudiante(editEstudiante.id, data as UpdateEstudiante);
        setNotification({ message: `Estudiante actualizado correctamente.`, type: "success" });
      } else {
        await addEstudiante(data as NewEstudiante);
        setNotification({ message: `Estudiante creado correctamente.`, type: "success" });
      }
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setNotification({ message: err?.message || "Error al guardar estudiante.", type: "error" });
    }
  };

  const handleToggleActivo = async (est: EstudianteOut) => {
    try {
      await toggleStatus(est.id, !est.activo);
      setNotification({
        message: `Estudiante ${est.activo ? "desactivado" : "activado"}.`,
        type: "success"
      });
    } catch {
      setNotification({ message: "No se pudo cambiar el estado del estudiante.", type: "error" });
    }
  };

  const handleDelete = async (est: EstudianteOut) => {
    if (!confirm(`¿Eliminar estudiante ${est.nombres} ${est.apellidos}?`)) return;

    try {
      await deleteEstudiante(est.id);
      setNotification({ message: `Estudiante eliminado correctamente.`, type: "success" });
    } catch {
      setNotification({ message: "No se pudo eliminar el estudiante.", type: "error" });
    }
  };

  return (
    <PageLayout title="Panel de Estudiantes">
      {showForm ? (
        <EstudianteForm
          estudiante={editEstudiante || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Crear Estudiante
            </button>
          </div>

          {loading && <LoadingScreen />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && (
            <EstudianteTable
              estudiantes={estudiantes}
              onEdit={handleEdit}
              onToggle={handleToggleActivo}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}
