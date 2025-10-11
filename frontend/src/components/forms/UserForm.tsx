// src/components/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { NewUser, UserFormProps } from '../../types/users';
import type { NewProfile } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

export function UserForm({
  user,
  loading = false,
  error,
  onSubmit,
  onCancel,
  firstUserMode = false,
}: UserFormProps) {
  const navigate = useNavigate();

  // Usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<'administrador' | 'administrativo' | 'padre_familia'>('administrador');

  // Perfil
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');

  // Precargar datos si es edición
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setTipo(user.tipo_usuario as 'administrador' | 'administrativo' | 'padre_familia');
      if (user.perfil) {
        setNombres(user.perfil.nombres || '');
        setApellidos(user.perfil.apellidos || '');
        setTelefono(user.perfil.telefono || '');
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let data: NewUser & { perfil?: NewProfile };

    if (user) {
      // Actualización
      data = {
        email: email,
        tipo_usuario: tipo,
        password: '', // password is required by NewUser, but not used in update
        perfil: undefined
      };

      // Perfil
      if (user.perfil) {
        data.perfil = {
          nombres: nombres,
          apellidos: apellidos,
          telefono: telefono
        };
      } else {
        // Si no había perfil antes, lo creamos completo
        data.perfil = { nombres, apellidos, telefono };
      }
    } else {
      // Creación
      data = {
        email,
        password,
        tipo_usuario: tipo,
        perfil: { nombres, apellidos, telefono }
      };
    }

    onSubmit(data);

    if (firstUserMode) navigate('/login');
  };


  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(firstUserMode ? '/login' : '/users');
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

        {/* Usuario */}
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
          <option value="administrativo">Plantel Administrativo</option>
          <option value="padre_familia">Padre / Tutor</option>
        </select>

        {/* Perfil */}
        <input
          type="text"
          placeholder="Nombres"
          value={nombres}
          onChange={e => setNombres(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={apellidos}
          onChange={e => setApellidos(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

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
}
