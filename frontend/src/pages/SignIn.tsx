// src/pages/SignIn.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/AuthContext';
import { type NewUser } from '../types/users';

const SignIn = () => {
    const navigate = useNavigate();
    const { addUser } = useUsers();
    const { login } = useAuth(); // obtenemos login del context
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: Partial<NewUser>) => {
        setLoading(true);
        setError(null);
        try {
            if (!data.password) throw new Error('Se requiere una contraseña');

            // 1. Crear el usuario
            await addUser(data as NewUser);

            // 2. Loguear automáticamente
            await login(data.email!, data.password!);

            // 3. Redirigir al dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <UserForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/login')}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default SignIn;
