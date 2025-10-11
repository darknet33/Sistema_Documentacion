import { useState, useMemo } from "react";
import type { EstudianteTableProps } from "../../types/estudiante";

export function EstudianteTable({ estudiantes, onEdit, onToggle, onDelete }: EstudianteTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // filas por página

  // Filtrar por búsqueda
  const filtered = useMemo(() => {
    return estudiantes.filter(e =>
      e.nombres.toLowerCase().includes(search.toLowerCase()) ||
      e.apellidos.toLowerCase().includes(search.toLowerCase()) ||
      e.codigo_estudiante.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, estudiantes]);

  const totalPages = Math.ceil(filtered.length / limit);
  const displayed = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="px-3 py-2 border rounded-lg w-1/3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div>
          Página {page} / {totalPages}
          <button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)} className="ml-2 px-2 py-1 bg-gray-200 rounded">◀</button>
          <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)} className="ml-1 px-2 py-1 bg-gray-200 rounded">▶</button>
        </div>
      </div>

      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Código</th>
            <th className="px-4 py-2 text-left">Nombres</th>
            <th className="px-4 py-2 text-left">Apellidos</th>
            <th className="px-4 py-2 text-left">Curso</th>
            <th className="px-4 py-2 text-center">Activo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(est => (
            <tr key={est.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
              <td className="px-4 py-2">{est.codigo_estudiante}</td>
              <td className="px-4 py-2">{est.nombres}</td>
              <td className="px-4 py-2">{est.apellidos}</td>
              <td className="px-4 py-2">{est.curso?.nombre} ({est.curso?.nivel})</td>
              <td className="px-4 py-2 text-center">
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={est.activo}
                    onChange={() => onToggle(est)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all"></div>
                  <div className="absolute ml-1 w-4 h-4 bg-white rounded-full transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                <button onClick={() => onEdit(est)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Editar</button>
                <button onClick={() => onDelete(est)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
