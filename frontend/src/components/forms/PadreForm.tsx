// src/components/forms/PadreForm.tsx   
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { NewUser, UserFormProps } from '../../types/users';
import type { NewProfile } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

export function PadreForm({
  user,
  loading = false,
  error,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const navigate = useNavigate();

  // Usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Perfil
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');

  // Precargar datos si es edición
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      if (user.perfil) {
        setCedulaIdentidad(user.perfil.cedula_identidad || '');
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
        email,
        tipo_usuario: 'padre_familia',
        password: '', // no se usa en update
        perfil: user.perfil
          ? { cedula_identidad: cedulaIdentidad, nombres, apellidos, telefono }
          : { cedula_identidad: cedulaIdentidad, nombres, apellidos, telefono },
      };
    } else {
      // Creación
      data = {
        email,
        password,
        tipo_usuario: 'padre_familia',
        perfil: { cedula_identidad: cedulaIdentidad, nombres, apellidos, telefono },
      };
    }

    onSubmit(data);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/padres');
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
        {user ? 'Actualizar Padre de Familia' : 'Nuevo Padre de Familia'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        {!user && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        )}

        {/* Perfil */}
        <input
          type="text"
          placeholder="Cedula de Identidad"
          value={cedulaIdentidad}
          onChange={(e) => setCedulaIdentidad(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition"
        >
          {loading
            ? 'Guardando...'
            : user
              ? 'Actualizar Padre de Familia'
              : 'Registrar Padre de Familia'}
        </button>
      </form>
    </div>
  );
}
