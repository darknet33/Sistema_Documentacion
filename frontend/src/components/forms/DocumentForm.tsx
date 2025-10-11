import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NewDocument, DocumentFormProps } from '../../types/document';

export function DocumentForm({
  document,
  loading = false,
  error,
  onSubmit,
  onCancel,
}: DocumentFormProps) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esObligatorio, setEsObligatorio] = useState(true);

  // Precargar datos si es edición
  useEffect(() => {
    if (document) {
      setNombre(document.nombre);
      setDescripcion(document.descripcion || '');
      setEsObligatorio(document.es_obligatorio);
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre del documento es obligatorio.');
      return;
    }

    const data: NewDocument = {
      nombre,
      descripcion,
      es_obligatorio: esObligatorio,
    };

    onSubmit(data);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/documentos');
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
        {document ? 'Editar Documento' : 'Crear Documento'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre del documento"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        {/* Descripción */}
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
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
            : document
              ? 'Actualizar Documento'
              : 'Registrar Documento'}
        </button>
      </form>
    </div>
  );
}
