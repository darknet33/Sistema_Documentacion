import { useState, useMemo } from "react";
import type { VincularEstudianteTableProps } from "../../types/estudiante";
import type { EstudianteOut } from "../../types/estudiante";
import { VincularEstudianteForm } from "../forms/VincularEstudianteForm";
import type { PadresEstudiantesCreate } from "../../types/padresEstudiantes";

export function VincularEstudianteTable({
  estudiantes,
  onVincular,
}: VincularEstudianteTableProps) {
  const [search, setSearch] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState<EstudianteOut | null>(null);

  // 🔍 Mostrar solo si hay búsqueda exacta
  const filtered = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return [];
    return estudiantes.filter(
      (e) => e.cedula_identidad?.toLowerCase() === trimmed
    );
  }, [search, estudiantes]);

  return (
    <div>
      {/* 🔹 Campo de búsqueda */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Ingrese la Cédula de Identidad del Estudiante"
          className="px-3 py-2 border rounded-lg w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔹 Tabla solo si hay resultados */}
      {search.trim() && (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Cedula de Identidad</th>
              <th className="px-4 py-2 text-left">Nombres</th>
              <th className="px-4 py-2 text-left">Apellidos</th>
              <th className="px-4 py-2 text-left">Curso</th>
              <th className="px-4 py-2 text-center">Activo</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((est) => (
                <tr
                  key={est.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{est.cedula_identidad}</td>
                  <td className="px-4 py-2">{est.nombres}</td>
                  <td className="px-4 py-2">{est.apellidos}</td>
                  <td className="px-4 py-2">
                    {est.curso?.nombre} ({est.curso?.nivel})
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={est.activo}
                      readOnly
                      className="cursor-pointer accent-green-500"
                    />
                  </td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => setSelectedEstudiante(est)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Vincular
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No se encontró ningún estudiante con ese código.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* 🔹 Formulario emergente */}
      {selectedEstudiante && (
        <VincularEstudianteForm
          estudiante={selectedEstudiante}
          onClose={() => setSelectedEstudiante(null)}
          onSubmit={(data: PadresEstudiantesCreate) => {
            onVincular(data);
            setSelectedEstudiante(null);
          }}
        />
      )}
    </div>
  );
}
