// src/pages/Users.tsx
import { useState } from 'react';
import { CurseTable, CurseForm, LoadingScreen, DocumentosRequeridosPanel } from '../components';
import { useCurse } from '../hooks/useCurse';
import type { CurseOut, NewCurse, UpdateCurse } from '../types/curse';
import { PageLayout } from '../layout/PageLayout';
import { useNotification } from '../context/NotificationContext';

const Curse = () => {
  const { curser, loading, error, addCurse, updateCurse, toggleStatus, deleteCurse } = useCurse();
  const [showForm, setShowForm] = useState(false);
  const [editCurse, setEditCurse] = useState<CurseOut | null>(null);
  const { setNotification } = useNotification();
  const [selectedCourse, setSelectedCourse] = useState<CurseOut | null>(null);
  const [showDocuments, setShowDocuments] = useState(false)

  const handleCreate = () => {
    setEditCurse(null);
    setShowForm(true);
  };

  const handleEdit = (curso: CurseOut) => {
    setEditCurse(curso);
    setShowForm(true);
  };

  const handleViewDocuments = (curso: CurseOut) => {
    setSelectedCourse(curso);
    setShowDocuments(true);
  };
  const handleSubmit = async (data: NewCurse | UpdateCurse) => {
    try {
      if (editCurse) {
        await updateCurse(editCurse.id, data as UpdateCurse);
        setNotification({
          message: `Curso ${data.nombre} ${data.nivel} actualizado con éxito.`,
          type: "success",
        });
      } else {
        await addCurse(data as NewCurse);
        setNotification({
          message: `Curso ${data.nombre} ${data.nivel} creado con éxito.`,
          type: "success",
        });
      }
      setShowForm(false);
    } catch (error: any) {
      console.error(error);
      setNotification({
        message: error?.message || "Error al guardar el curso.",
        type: "error",
      });
    }
  };

  const handleToggle = async (curse: CurseOut) => {
    try {
      await toggleStatus(curse.id, !curse.activo);
      setNotification({
        message: `Curso ${curse.nombre} ${curse.nivel} ${curse.activo ? "desactivado" : "activado"}.`,
        type: "success",
        duration: 2500
      });
    } catch {
      setNotification({
        message: "Error al cambiar el estado del curso.",
        type: "error",
        duration: 3000
      });
    }
  };

  const handleDelete = async (curse: CurseOut) => {
    if (confirm(`¿Eliminar curso ${curse.nombre}?`)) {
      try {
        await deleteCurse(curse.id);
        setNotification({
          message: `Curso ${curse.nombre} eliminado.`,
          type: "success",
          duration: 3000
        });
      } catch {
        setNotification({
          message: "No se pudo eliminar el curso.",
          type: "error",
          duration: 3000
        });
      }
    }
  };

  return (
    <PageLayout title='Panel de Curso'>
      {showForm ? (
        <CurseForm
          curse={editCurse || undefined}
          loading={false}
          error={null}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Crear Curso
            </button>
          </div>

          {loading && <LoadingScreen />}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && (
            <CurseTable
              curser={curser}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onPanel={handleViewDocuments}
            />
          )}
        </>
      )}

      {showDocuments && selectedCourse && (
        <DocumentosRequeridosPanel curse={selectedCourse} onClose={() => setShowDocuments(false)} />
      )}
    </PageLayout>
  );
};

export default Curse;
