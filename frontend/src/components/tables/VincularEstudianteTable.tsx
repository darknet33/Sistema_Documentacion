import { useState, useMemo } from "react";
import type { VincularEstudianteTableProps, EstudianteOut } from "../../types/estudiante";
import { VincularEstudianteForm } from "../forms/VincularEstudianteForm";
import type { PadresEstudiantesCreate } from "../../types/padresEstudiantes";

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Componente de Búsqueda
function SearchInput({ 
  search, 
  onSearchChange 
}: { 
  search: string; 
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <label htmlFor="ci-search" className="block text-sm font-medium text-gray-700 mb-2">
        🔍 Buscar Estudiante por Cédula de Identidad
      </label>
      <input
        id="ci-search"
        type="text"
        placeholder="Ej: 12345678"
        className="w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <p className="text-xs text-gray-500 mt-2">
        Ingrese exactamente la cédula de identidad del estudiante
      </p>
    </div>
  );
}

// Badge de Estado
function StatusBadge({ activo }: { activo: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      activo 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {activo ? '✅ Activo' : '❌ Inactivo'}
    </span>
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

// ----------------------------------------------------------------
// Componente de Card para Móvil
// ----------------------------------------------------------------

function EstudianteCard({ 
  estudiante, 
  onVincular 
}: { 
  estudiante: EstudianteOut; 
  onVincular: (est: EstudianteOut) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header con nombre y estado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 text-base">
            {estudiante.nombres} {estudiante.apellidos}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            CI: {estudiante.cedula_identidad}
          </p>
        </div>
        <StatusBadge activo={estudiante.activo} />
      </div>

      {/* Información del curso */}
      <div className="mb-4">
        <CourseBadge curso={estudiante.curso} />
      </div>

      {/* Acción de vincular */}
      <button
        onClick={() => onVincular(estudiante)}
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <span className="mr-2">🔗</span>
        Vincular Estudiante
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop
// ----------------------------------------------------------------

function VincularEstudianteDesktopTable({ 
  estudiantes, 
  onVincular 
}: { 
  estudiantes: EstudianteOut[]; 
  onVincular: (est: EstudianteOut) => void;
}) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
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
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {estudiantes.map((est) => (
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
                <StatusBadge activo={est.activo} />
              </td>

              {/* Columna Acción */}
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onVincular(est)}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="mr-2">🔗</span>
                  Vincular
                </button>
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

function VincularEstudianteMobileList({ 
  estudiantes, 
  onVincular 
}: { 
  estudiantes: EstudianteOut[]; 
  onVincular: (est: EstudianteOut) => void;
}) {
  return (
    <div className="space-y-4">
      {estudiantes.map((est) => (
        <EstudianteCard 
          key={est.id}
          estudiante={est}
          onVincular={onVincular}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Estado Vacío
// ----------------------------------------------------------------

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  if (!hasSearch) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-gray-400 text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Buscar Estudiante
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Ingrese la cédula de identidad del estudiante que desea vincular
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
      <div className="text-gray-400 text-5xl mb-4">😕</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No se encontró el estudiante
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Verifique que la cédula de identidad sea correcta y que el estudiante esté registrado en el sistema.
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function VincularEstudianteTable({
  estudiantes,
  onVincular,
}: VincularEstudianteTableProps) {
  const [search, setSearch] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState<EstudianteOut | null>(null);

  // 🔍 Filtrar por búsqueda exacta de cédula
  const filtered = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return [];
    return estudiantes.filter(
      (e) => e.cedula_identidad?.toLowerCase() === trimmed
    );
  }, [search, estudiantes]);

  const hasSearch = search.trim().length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div>
      {/* 🔹 Campo de búsqueda */}
      <SearchInput search={search} onSearchChange={setSearch} />

      {/* 🔹 Resultados de búsqueda */}
      {hasSearch && (
        <div className="mb-6">
          {hasResults ? (
            <>
              {/* Versión Desktop */}
              <div className="hidden sm:block">
                <VincularEstudianteDesktopTable 
                  estudiantes={filtered}
                  onVincular={setSelectedEstudiante}
                />
              </div>

              {/* Versión Móvil */}
              <div className="sm:hidden">
                <VincularEstudianteMobileList 
                  estudiantes={filtered}
                  onVincular={setSelectedEstudiante}
                />
              </div>

              {/* Información de resultados */}
              <p className="text-sm text-gray-500 mt-3 text-center">
                Se encontró {filtered.length} estudiante{filtered.length !== 1 ? 's' : ''}
              </p>
            </>
          ) : (
            <EmptyState hasSearch={hasSearch} />
          )}
        </div>
      )}

      {/* 🔹 Estado inicial (sin búsqueda) */}
      {!hasSearch && <EmptyState hasSearch={hasSearch} />}

      {/* 🔹 Formulario emergente de vinculación */}
      {selectedEstudiante && (
        <VincularEstudianteForm
          estudiante={selectedEstudiante}
          onClose={() => setSelectedEstudiante(null)}
          onSubmit={(data: PadresEstudiantesCreate) => {
            onVincular(data);
            setSelectedEstudiante(null);
            setSearch(""); // Limpiar búsqueda después de vincular
          }}
        />
      )}
    </div>
  );
}