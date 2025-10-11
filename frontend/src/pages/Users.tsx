// src/pages/Users.tsx
import { useState } from 'react';
import { Sidebar, UserTable, UserForm, LoadingScreen, Notification } from '../components';
import { useUsers } from '../hooks/useUsers';
import { type UserOut, type NewUser, type UpdateUser } from '../types/users';

const Users = () => {
  const { users, loading, error, addUser, updateUser, toggleStatus, deleteUser } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserOut | null>(null);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

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
        setNotification({ message: `Usuario ${data.perfil?.nombres} ${data.perfil?.apellidos} actualizado con éxito.`, type: 'success' });
      } else {
        await addUser(data as NewUser);
        setNotification({ message: `Usuario ${data.perfil?.nombres} ${data.perfil?.apellidos} creado con éxito.`, type: 'success' });
      }
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setNotification({ message: ` ${error} `, type: 'error' });
    }
  };

  const handleToggle = (user: UserOut) => {
    try {
      toggleStatus(user.id, !user.activo);
      !user.activo
        ? setNotification({ message: `Usuario ${user.email} activado .`, type: 'success' })
        : setNotification({ message: `Usuario ${user.email} desactivado .`, type: 'success' })
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error al procesar la operación.', type: 'error' });
    }
  };

  const handleDelete = (user: UserOut) => {
    if (confirm(`¿Eliminar usuario ${user.email}?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Usuarios</h1>

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
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Users;
