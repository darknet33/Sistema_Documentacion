// src/pages/Padres.tsx
import { useState } from "react";
import { UserTable, LoadingScreen, Notification, PadreForm } from "../components";
import { useUsers } from "../hooks/useUsers";
import { type UserOut, type NewUser, type UpdateUser } from "../types/users";
import { PageLayout } from "../layout/PageLayout";

const Padres = () => {
    const { users, loading, error, addUser, updateUser, toggleStatus, deleteUser } = useUsers();
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<UserOut | null>(null);
    const [notification, setNotification] = useState<{ message: string; type?: "success" | "error" } | null>(null);

    // 🔹 Filtrar solo padres de familia
    const padres = users.filter((u) => u.tipo_usuario === "padre_familia");

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
            const payload = { ...data, tipo_usuario: "padre_familia" }; // 🔹 Forzar tipo padre
            if (editUser) {
                await updateUser(editUser.id, payload as UpdateUser);
                setNotification({
                    message: `Padre ${payload.perfil?.nombres} ${payload.perfil?.apellidos} actualizado con éxito.`,
                    type: "success",
                });
            } else {
                await addUser(payload as NewUser);
                setNotification({
                    message: `Padre ${payload.perfil?.nombres} ${payload.perfil?.apellidos} creado con éxito.`,
                    type: "success",
                });
            }
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setNotification({ message: `Error: ${error}`, type: "error" });
        }
    };

    const handleToggle = async (user: UserOut) => {
        try {
            await toggleStatus(user.id, !user.activo);
            setNotification({
                message: !user.activo
                    ? `Padre ${user.email} activado correctamente.`
                    : `Padre ${user.email} desactivado.`,
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setNotification({ message: "Error al procesar la operación.", type: "error" });
        }
    };

    const handleDelete = (user: UserOut) => {
        if (confirm(`¿Eliminar al padre ${user.email}?`)) {
            deleteUser(user.id);
        }
    };

    return (
        <PageLayout title="Panel de Padres de Familia">
            {showForm ? (
                <PadreForm
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
                            Crear Padre
                        </button>
                    </div>

                    {loading && <LoadingScreen />}
                    {error && <p className="text-red-600">{error}</p>}
                    {!loading && (
                        <UserTable
                            users={padres}
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
        </PageLayout>
    );
};

export default Padres;
