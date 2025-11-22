import { useState, useMemo } from "react";
import type { EstudianteTableProps, EstudianteOut } from "../../types/estudiante";

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Toggle Switch Compacto
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-8 h-4 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
      <div className="absolute ml-0.5 w-3 h-3 bg-white rounded-full transform transition-transform duration-200 peer-checked:translate-x-4 shadow-sm"></div>
    </label>
  );
}

// Badge de Curso
function CourseBadge({ curso }: { curso: EstudianteOut['curso'] }) {
  if (!curso) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        Sin curso
      </span>
    );
  }

  const getLevelColor = (nivel: string) => {
    const colors = {
      'Inicial': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Primaria': 'bg-green-100 text-green-800 border border-green-200',
      'Secundaria': 'bg-purple-100 text-purple-800 border border-purple-200',
      'Superior': 'bg-orange-100 text-orange-800 border border-orange-200'
    };
    return colors[nivel as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(curso.nivel)}`}>
      {curso.nombre}
    </span>
  );
}

// Acciones Compactas del Estudiante
function EstudianteActions({ 
  estudiante, 
  onEdit, 
  onDelete 
}: { 
  estudiante: EstudianteOut; 
  onEdit: (est: EstudianteOut) => void; 
  onDelete: (est: EstudianteOut) => void;
}) {
  return (
    <div className="flex gap-1">
      <button 
        onClick={() => onEdit(estudiante)} 
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-blue-600"
        title="Editar estudiante"
      >
        ✏️
      </button>
      <button 
        onClick={() => onDelete(estudiante)} 
        className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-red-600"
        title="Eliminar estudiante"
      >
        🗑️
      </button>
    </div>
  );
}

// Componente de Búsqueda y Paginación
function SearchAndPagination({ 
  search, 
  onSearchChange, 
  page, 
  totalPages, 
  onPageChange 
}: {
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o cédula..."
        className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Página {page} de {totalPages}</span>
        <div className="flex gap-1">
          <button 
            disabled={page <= 1} 
            onClick={() => onPageChange(page - 1)} 
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ◀
          </button>
          <button 
            disabled={page >= totalPages} 
            onClick={() => onPageChange(page + 1)} 
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil - OPTIMIZADO
// ----------------------------------------------------------------

function EstudianteCard({ 
  estudiante, 
  onEdit, 
  onToggle, 
  onDelete 
}: { 
  estudiante: EstudianteOut; 
  onEdit: (est: EstudianteOut) => void; 
  onToggle: (est: EstudianteOut) => void;
  onDelete: (est: EstudianteOut) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header compacto con nombre y curso */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 text-base">
            {estudiante.nombres} {estudiante.apellidos}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            CI: {estudiante.cedula_identidad}
          </p>
        </div>
        <CourseBadge curso={estudiante.curso} />
      </div>

      {/* Estado y acciones en línea */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Activo:</span>
          <ToggleSwitch checked={estudiante.activo} onChange={() => onToggle(estudiante)} />
        </div>
        <div className="text-xs text-gray-500">
          {estudiante.activo ? '✅ Activo' : '⏸️ Inactivo'}
        </div>
        <EstudianteActions 
          estudiante={estudiante} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop - OPTIMIZADO
// ----------------------------------------------------------------

function EstudianteDesktopTable({ 
  estudiantes, 
  onEdit, 
  onToggle, 
  onDelete 
}: EstudianteTableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estudiante
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cédula
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Curso
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {estudiantes.map(est => (
            <tr key={est.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* Columna Estudiante */}
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">
                  {est.nombres} {est.apellidos}
                </div>
              </td>

              {/* Columna Cédula */}
              <td className="px-4 py-3 text-sm text-gray-600">
                {est.cedula_identidad}
              </td>

              {/* Columna Curso */}
              <td className="px-4 py-3">
                <CourseBadge curso={est.curso} />
              </td>

              {/* Columna Estado */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ToggleSwitch checked={est.activo} onChange={() => onToggle(est)} />
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {est.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </td>

              {/* Columna Acciones */}
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <button 
                    onClick={() => onEdit(est)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium transition-colors duration-200 hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(est)} 
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium transition-colors duration-200 hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Lista para Móvil
// ----------------------------------------------------------------

function EstudianteMobileList({ 
  estudiantes, 
  onEdit, 
  onToggle, 
  onDelete 
}: EstudianteTableProps) {
  return (
    <div className="space-y-3">
      {estudiantes.map(est => (
        <EstudianteCard 
          key={est.id} 
          estudiante={est}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function EstudianteTable({ estudiantes, onEdit, onToggle, onDelete }: EstudianteTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filtrar por búsqueda
  const filtered = useMemo(() => {
    return estudiantes.filter(e =>
      e.nombres.toLowerCase().includes(search.toLowerCase()) ||
      e.apellidos.toLowerCase().includes(search.toLowerCase()) ||
      e.cedula_identidad.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, estudiantes]);

  const totalPages = Math.ceil(filtered.length / limit);
  const displayed = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <SearchAndPagination 
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Versión Desktop */}
      <div className="hidden sm:block">
        <EstudianteDesktopTable 
          estudiantes={displayed}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>

      {/* Versión Móvil */}
      <div className="sm:hidden">
        <EstudianteMobileList 
          estudiantes={displayed}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}