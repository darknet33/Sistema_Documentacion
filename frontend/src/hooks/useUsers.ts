import { useState, useEffect } from 'react';
import { fetchUsersApi, createUserApi, updateUserApi, toggleUserStatusApi, deleteUserApi } from '../api/users';
import { type UserOut, type NewUser, type UpdateUser } from '../types/users';

export const useUsers = () => {
    const [users, setUsers] = useState<UserOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchUsersApi();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (user: NewUser) => {
        const newUser = await createUserApi(user);
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const updateUser = async (id: number, user: UpdateUser) => {
        const updated = await updateUserApi(id, user);
        setUsers(prev => prev.map(u => u.id === id ? updated : u));
        return updated;
    };

    const toggleStatus = async (id: number, activo: boolean) => {
        const updated = await toggleUserStatusApi(id, activo);
        setUsers(prev => prev.map(u => u.id === id ? updated : u));
        return updated;
    };

    const deleteUser = async (id: number) => {
        await deleteUserApi(id);
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return { users, loading, error, addUser, updateUser, toggleStatus, deleteUser, reload: loadUsers };
};
