// src/pages/Users.tsx
import { useEffect, useState } from 'react';
import { Sidebar, CurseTable, CurseForm, LoadingScreen, Notification, DocumentosRequeridosPanel } from '../components';
import { useCurse } from '../hooks/useCurse';
import type { CurseOut, NewCurse, UpdateCurse } from '../types/curse';
import { useAuth } from '../context/AuthContext';

const Curse = () => {
  const { curser, loading, error, addCurse, updateCurse, toggleStatus, deleteCurse } = useCurse();
  const { token, logout } = useAuth()
  const [showForm, setShowForm] = useState(false);
  const [editCurse, setEditCurse] = useState<CurseOut | null>(null);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CurseOut | null>(null);
  const [showDocuments,setShowDocuments] = useState(false)

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
        setNotification({ message: `Curso: ${data.nombre} ${data.nivel} actualizado con éxito.`, type: 'success' });
      } else {
        await addCurse(data as NewCurse);
        setNotification({ message: `Curso: ${data.nombre} ${data.nivel} creado con éxito.`, type: 'success' });
      }
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setNotification({ message: ` ${error} `, type: 'error' });
    }
  };

  const handleToggle = (curse: CurseOut) => {
    try {
      toggleStatus(curse.id, !curse.activo);
      !curse.activo
        ? setNotification({ message: `Curso ${curse.nombre} ${curse.nivel} activado .`, type: 'success' })
        : setNotification({ message: `Curso ${curse.nombre} ${curse.nivel} desactivado .`, type: 'success' })
    } catch (error) {
      console.error(error);
      setNotification({ message: `Error al procesar la operación. `, type: 'error' });
    }
  };

  const handleDelete = (curse: CurseOut) => {
    if (confirm(`¿Eliminar usuario ${curse.nombre}?`)) {
      deleteCurse(curse.id);
    }
  };

  useEffect(() => {
    if (!token) logout();

  }, [token])

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Cursos</h1>

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

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

      </main>
      {showDocuments && selectedCourse && (
        <DocumentosRequeridosPanel curse={selectedCourse} onClose={()=>setShowDocuments(false)}/>
      )}
    </div>
  );
};

export default Curse;
