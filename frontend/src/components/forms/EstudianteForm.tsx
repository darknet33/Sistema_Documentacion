import React, { useState, useEffect } from "react";
import type { EstudianteFormProps, NewEstudiante, UpdateEstudiante } from "../../types/estudiante";
import { ArrowLeft } from "lucide-react";
import { useCurse } from "../../hooks/useCurse";

export function EstudianteForm({ estudiante, loading = false, error, onSubmit, onCancel }: EstudianteFormProps) {
  const [codigo, setCodigo] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [cursoId, setCursoId] = useState<number | undefined>(undefined);
  const [nivelFiltro, setNivelFiltro] = useState<string>("");

  const { curser, loading: loadingCursos } = useCurse();

  useEffect(() => {
    if (estudiante) {
      setCodigo(estudiante.cedula_identidad);
      setNombres(estudiante.nombres);
      setApellidos(estudiante.apellidos);
      setFechaNacimiento(estudiante.fecha_nacimiento);
      setCursoId(estudiante.curso_id);

      // Preseleccionar el nivel del curso existente
      if (estudiante.curso) setNivelFiltro(estudiante.curso.nivel);
    }
  }, [estudiante, curser]);

  // Filtrar cursos según el nivel seleccionado
  const cursosFiltrados = nivelFiltro
    ? curser.filter(c => c.nivel === nivelFiltro)
    : curser;

  // Función para convertir a formato nombre propio
  const capitalizeWords = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !nombres || !apellidos || !fechaNacimiento || !cursoId) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const data: NewEstudiante | UpdateEstudiante = {
      cedula_identidad: codigo,
      nombres: capitalizeWords(nombres),
      apellidos: capitalizeWords(apellidos),
      fecha_nacimiento: fechaNacimiento,
      curso_id: cursoId,
    };

    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto">
      <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Atrás
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        {estudiante ? "Editar Estudiante" : "Crear Estudiante"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Cedula de identidad"
          className="w-full px-3 py-2 border rounded-lg"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          disabled={!!estudiante}
          required
        />

        <input
          type="text"
          placeholder="Nombres"
          className="w-full px-3 py-2 border rounded-lg"
          value={nombres}
          onChange={e => setNombres(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Apellidos"
          className="w-full px-3 py-2 border rounded-lg"
          value={apellidos}
          onChange={e => setApellidos(e.target.value)}
          required
        />

        <label className="block">
          <span className="text-gray-700">Fecha de Nacimiento</span>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg mt-1"
            value={fechaNacimiento}
            onChange={e => setFechaNacimiento(e.target.value)}
            required
          />
        </label>

        {/* Filtro de nivel */}
        <label className="block">
          <span className="text-gray-700">Nivel</span>
          <select
            className="w-full px-3 py-2 border rounded-lg mt-1"
            value={nivelFiltro}
            onChange={e => {
              setNivelFiltro(e.target.value);
              setCursoId(undefined); // Resetear curso al cambiar nivel
            }}
          >
            <option value="">Todos los niveles</option>
            {[...new Set(curser.map(c => c.nivel))].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        {/* Select de cursos filtrados */}
        <label className="block">
          <span className="text-gray-700">Grado</span>
          {loadingCursos ? (
            <p className="text-gray-500 mt-1">Cargando grados...</p>
          ) : (
            <select
              value={cursoId ?? ""}
              onChange={e => setCursoId(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            >
              <option value="">Seleccione el grado</option>
              {cursosFiltrados.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.nivel})
                </option>
              ))}
            </select>
          )}
        </label>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition"
        >
          {loading ? "Guardando..." : estudiante ? "Actualizar Estudiante" : "Registrar Estudiante"}
        </button>
      </form>
    </div>
  );
}
