// src/pages/Users.tsx
import { useState } from 'react';
import { UserTable, UserForm, LoadingScreen } from '../components';
import { useUsers } from '../hooks/useUsers';
import { type UserOut, type NewUser, type UpdateUser } from '../types/users';
import { PageLayout } from '../layout/PageLayout';
import { useNotification } from '../context/NotificationContext';

const Users = () => {
  const { users, loading, error, addUser, updateUser, toggleStatus, deleteUser } = useUsers();
  const { setNotification } = useNotification();

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserOut | null>(null);

  const handleCreate = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: UserOut) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleSubmit = async (data: NewUser | UpdateUser) => {
    try {
      if (editUser) {
        await updateUser(editUser.id, data as UpdateUser);
        setNotification({
          message: `Usuario ${data.perfil?.nombres} ${data.perfil?.apellidos} actualizado con éxito.`,
          type: 'success',
        });
      } else {
        await addUser(data as NewUser);
        setNotification({
          message: `Usuario ${data.perfil?.nombres} ${data.perfil?.apellidos} creado con éxito.`,
          type: 'success',
        });
      }
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setNotification({
        message: err?.message || 'Error al procesar la operación.',
        type: 'error',
      });
    }
  };

  const handleToggle = async (user: UserOut) => {
    try {
      await toggleStatus(user.id, !user.activo);
      setNotification({
        message: !user.activo
          ? `Usuario ${user.email} activado.`
          : `Usuario ${user.email} desactivado.`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      setNotification({ message: err?.message || 'Error al procesar la operación.', type: 'error' });
    }
  };

  const handleDelete = async (user: UserOut) => {
    if (confirm(`¿Eliminar usuario ${user.email}?`)) {
      try {
        await deleteUser(user.id);
        setNotification({ message: `Usuario ${user.email} eliminado.`, type: 'success' });
      } catch (err: any) {
        console.error(err);
        setNotification({ message: err?.message || 'Error al eliminar usuario.', type: 'error' });
      }
    }
  };

  return (
    <PageLayout title="Panel de Usuarios">
      {showForm ? (
        <UserForm
          user={editUser || undefined}
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
              Crear Usuario
            </button>
          </div>

          {loading && <LoadingScreen />}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && (
            <UserTable
              users={users}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Users;
