// src/components/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { NewCurse, CurseFormProps } from '../../types/curse';
import { useNavigate } from 'react-router-dom';

export function CurseForm({
  curse,
  loading = false,
  error,
  onSubmit,
  onCancel,
}: CurseFormProps) {
  const navigate = useNavigate();

  // Curso
  // hacer los estados

  const [nombre, setNombre] = useState("")
  const [nivel, setNivel] = useState("")

  // Precargar datos si es edición
  useEffect(() => {
    if (curse) {
      setNombre(curse.nombre)
      setNivel(curse.nivel)
    }
  }, [curse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!nombre.trim() || !nivel.trim()) {
      alert("Por favor selecciona un curso y un nivel"); // o usa un estado de error
      return;
    }

    let data: NewCurse;

    if (curse) {
      // Actualización
      data = {
        nombre: nombre,
        nivel: nivel
      };
    } else {
      // Creación
      data = {
        nombre,
        nivel
      };
    }

    onSubmit(data);
  };


  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/cursos');
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
        {curse ? 'Editar Curso' : 'Crear Curso'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Cursos */}
        <select
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Seleccione un curso</option>
          <option value="1ro">1ro</option>
          <option value="2do">2do</option>
          <option value="3ro">3ro</option>
          <option value="4to">4to</option>
          <option value="5to">5to</option>
          <option value="6to">6to</option>
        </select>


        <select
          value={nivel}
          onChange={e => setNivel(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Seleccione nivel</option>
          <option value="Secundaria">Secundaria</option>
        </select>


        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition"
        >
          {loading
            ? 'Guardando...'
            : curse
              ? 'Actualizar Curso'
              : 'Registrar Curso'}
        </button>
      </form>
    </div>
  );
}
