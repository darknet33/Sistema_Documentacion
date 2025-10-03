// src/components/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { type NewUser, type UserOut } from '../../types/users';
import { useNavigate } from 'react-router-dom';

interface UserFormProps {
  user?: UserOut;                     // si viene, es edición
  loading?: boolean;                  // mostrar estado
  error?: string | null;              // mensaje de error
  onSubmit: (data: Partial<NewUser>) => void;
  onCancel?: () => void;              // opcional, si no se pasa usamos navegación automática
  firstUserMode?: boolean;            // si es el primer registro
}

export function UserForm ({
  user,
  loading = false,
  error,
  onSubmit,
  onCancel,
  firstUserMode = false,
}:UserFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<'administrador' | 'administrativo' | 'padre_familia'>('administrador');

  // precargar datos si es edición
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setTipo(user.tipo_usuario as 'administrador' | 'administrativo' | 'padre_familia');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<NewUser> = { email, tipo_usuario: tipo };
    if (!user) data.password = password; // contraseña solo en creación
    onSubmit(data);

    // si es primer usuario, redirige a login automáticamente
    if (firstUserMode) {
      navigate('/login');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(firstUserMode ? '/login' : '/users'); // navegación por defecto
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto">
      <button
        onClick={handleCancel}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Atrás
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">
        {user ? 'Editar Usuario' : firstUserMode ? 'Registrar Primer Usuario' : 'Crear Usuario'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />

        {!user && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        )}

        <select
          value={tipo}
          onChange={e => setTipo(e.target.value as 'administrador' | 'administrativo' | 'padre_familia')}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="administrador">Administrador</option>
          <option value="administrativo">Administrativo</option>
          <option value="padre_familia">Padre de Familia</option>
        </select>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading
            ? 'Guardando...'
            : user
              ? 'Actualizar Usuario'
              : firstUserMode
                ? 'Registrar y Continuar'
                : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
};