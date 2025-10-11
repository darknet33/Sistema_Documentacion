import { useState } from "react";
import { Sidebar, EstudianteForm, EstudianteTable, LoadingScreen, Notification } from "../components";
import { useEstudiantes } from "../hooks/useEstudiantes";
import type { EstudianteOut, NewEstudiante, UpdateEstudiante } from "../types/estudiante";

export default function Estudiantes() {
  const { estudiantes, loading, error, addEstudiante, updateEstudiante, toggleStatus, deleteEstudiante } = useEstudiantes();

  const [showForm, setShowForm] = useState(false);
  const [editEstudiante, setEditEstudiante] = useState<EstudianteOut | null>(null);
  const [notification, setNotification] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const handleCreate = () => { setEditEstudiante(null); setShowForm(true); };
  const handleEdit = (est: EstudianteOut) => { setEditEstudiante(est); setShowForm(true); };

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
    } catch (err) {
      console.error(err);
      setNotification({ message: `Error: ${err}`, type: "error" });
    }
  };

  const handleToggleActivo = async (est: EstudianteOut) => {
    await toggleStatus(est.id, !est.activo);
    setNotification({ message: `Estudiante ${est.activo ? "desactivado" : "activado"}.`, type: "success" });
  };

  const handleDelete = async (est: EstudianteOut) => {
    if (confirm(`Eliminar estudiante ${est.nombres} ${est.apellidos}?`)) {
      await deleteEstudiante(est.id);
      setNotification({ message: `Estudiante eliminado.`, type: "success" });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Estudiantes</h1>

        {showForm ? (
          <EstudianteForm estudiante={editEstudiante || undefined} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Crear Estudiante</button>
            </div>

            {loading && <LoadingScreen />}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && <EstudianteTable estudiantes={estudiantes} onEdit={handleEdit} onToggle={handleToggleActivo} onDelete={handleDelete} />}
          </>
        )}

        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </main>
    </div>
  );
}
