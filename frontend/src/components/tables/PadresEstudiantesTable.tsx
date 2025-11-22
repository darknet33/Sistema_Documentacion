import type { PadresEstudiantesTablePendingProps, PadresEstudiantesOut } from "../../types/padresEstudiantes";

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Avatar de Usuario
function UserAvatar({ 
  nombres, 
  apellidos, 
  bgColor = 'blue' 
}: { 
  nombres?: string; 
  apellidos?: string;
  bgColor?: 'blue' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600'
  };

  const initials = `${nombres?.charAt(0) || ''}${apellidos?.charAt(0) || ''}`;
  
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${colorClasses[bgColor]}`}>
      {initials || '?'}
    </div>
  );
}

// Badge de Parentesco
function ParentescoBadge({ parentesco }: { parentesco: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
      👨‍👦 {parentesco}
    </span>
  );
}

// Formateador de fecha
function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Componente de Rechazo
function RechazoForm({ 
  rel, 
  selectedId, 
  observacion, 
  setObservacion, 
  handleRechazar,
  onCancel 
}: { 
  rel: PadresEstudiantesOut;
  selectedId: number | null;
  observacion: string;
  setObservacion: (value: string) => void;
  handleRechazar: (id: number) => void;
  onCancel: () => void;
}) {
  if (selectedId !== rel.id) return null;

  return (
    <div className="w-full max-w-xs bg-red-50 border border-red-200 rounded-xl p-4 mt-2">
      <label className="block text-sm font-medium text-red-800 mb-2">
        📝 Motivo de rechazo
      </label>
      <textarea
        placeholder="Ingresa el motivo del rechazo..."
        className="w-full border border-red-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none"
        rows={3}
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <span className="mr-1">↶</span>
          Cancelar
        </button>
        <button
          onClick={() => handleRechazar(rel.id)}
          disabled={!observacion.trim()}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span className="mr-1">🗑️</span>
          Confirmar
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil
// ----------------------------------------------------------------

function SolicitudCard({ 
  rel, 
  selectedId, 
  observacion, 
  setObservacion, 
  handleAceptar, 
  handleRechazar,
  setSelectedId 
}: { 
  rel: PadresEstudiantesOut;
  selectedId: number | null;
  observacion: string;
  setObservacion: (value: string) => void;
  handleAceptar: (id: number) => void;
  handleRechazar: (id: number) => void;
  setSelectedId: (id: number | null) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header con información del padre */}
      <div className="flex items-start gap-3 mb-4">
        <UserAvatar 
          nombres={rel.perfil?.nombres} 
          apellidos={rel.perfil?.apellidos} 
          bgColor="blue"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base">
            {rel.perfil?.nombres} {rel.perfil?.apellidos || "Sin nombre"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            CI: {rel.perfil?.cedula_identidad}
          </p>
          <ParentescoBadge parentesco={rel.parentesco} />
        </div>
      </div>

      {/* Información del estudiante */}
      <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <UserAvatar 
          nombres={rel.estudiante?.nombres} 
          apellidos={rel.estudiante?.apellidos} 
          bgColor="green"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm">
            {rel.estudiante?.nombres} {rel.estudiante?.apellidos}
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            CI: {rel.estudiante?.cedula_identidad}
          </p>
          <p className="text-xs text-blue-600 font-medium mt-1">
            {rel.estudiante?.curso?.nombre} ({rel.estudiante?.curso?.nivel})
          </p>
        </div>
      </div>

      {/* Fecha de solicitud */}
      <div className="text-xs text-gray-500 mb-4">
        📅 {formatDateTime(rel.fecha_creacion)}
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => handleAceptar(rel.id)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <span className="mr-1">✅</span>
            Aceptar
          </button>

          {selectedId === rel.id ? (
            <button
              onClick={() => setSelectedId(null)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <span className="mr-1">↶</span>
              Cancelar
            </button>
          ) : (
            <button
              onClick={() => setSelectedId(rel.id)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <span className="mr-1">❌</span>
              Rechazar
            </button>
          )}
        </div>

        <RechazoForm 
          rel={rel}
          selectedId={selectedId}
          observacion={observacion}
          setObservacion={setObservacion}
          handleRechazar={handleRechazar}
          onCancel={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop
// ----------------------------------------------------------------

function PadresEstudiantesDesktopTable({
  pendientes,
  selectedId,
  observacion,
  setSelectedId,
  setObservacion,
  handleAceptar,
  handleRechazar,
}: PadresEstudiantesTablePendingProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Padre/Tutor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parentesco
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Solicitud
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {pendientes.map((rel) => (
              <tr key={rel.id} className="hover:bg-gray-50 transition-colors duration-150">
                {/* Información del Padre/Tutor */}
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <UserAvatar 
                      nombres={rel.perfil?.nombres} 
                      apellidos={rel.perfil?.apellidos} 
                      bgColor="blue"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {rel.perfil?.nombres} {rel.perfil?.apellidos || "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CI: {rel.perfil?.cedula_identidad}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Información del Estudiante */}
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <UserAvatar 
                      nombres={rel.estudiante?.nombres} 
                      apellidos={rel.estudiante?.apellidos} 
                      bgColor="green"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {rel.estudiante?.nombres} {rel.estudiante?.apellidos}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CI: {rel.estudiante?.cedula_identidad}
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {rel.estudiante?.curso?.nombre}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Parentesco */}
                <td className="px-4 py-3">
                  <ParentescoBadge parentesco={rel.parentesco} />
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDateTime(rel.fecha_creacion)}
                </td>

                {/* Acciones */}
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAceptar(rel.id)}
                        className="inline-flex items-center px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                      >
                        <span className="mr-1">✅</span>
                        Aceptar
                      </button>

                      {selectedId === rel.id ? (
                        <button
                          onClick={() => setSelectedId(null)}
                          className="inline-flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          <span className="mr-1">↶</span>
                          Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedId(rel.id)}
                          className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          <span className="mr-1">❌</span>
                          Rechazar
                        </button>
                      )}
                    </div>

                    <RechazoForm 
                      rel={rel}
                      selectedId={selectedId}
                      observacion={observacion}
                      setObservacion={setObservacion}
                      handleRechazar={handleRechazar}
                      onCancel={() => setSelectedId(null)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Lista para Móvil
// ----------------------------------------------------------------

function PadresEstudiantesMobileList({
  pendientes,
  selectedId,
  observacion,
  setSelectedId,
  setObservacion,
  handleAceptar,
  handleRechazar,
}: PadresEstudiantesTablePendingProps) {
  return (
    <div className="space-y-4">
      {pendientes.map((rel) => (
        <SolicitudCard 
          key={rel.id}
          rel={rel}
          selectedId={selectedId}
          observacion={observacion}
          setObservacion={setObservacion}
          handleAceptar={handleAceptar}
          handleRechazar={handleRechazar}
          setSelectedId={setSelectedId}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function PadresEstudiantesTable({
  pendientes,
  selectedId,
  observacion,
  setSelectedId,
  setObservacion,
  handleAceptar,
  handleRechazar,
}: PadresEstudiantesTablePendingProps) {
  return (
    <div>
      {/* Versión Desktop */}
      <div className="hidden lg:block">
        <PadresEstudiantesDesktopTable 
          pendientes={pendientes}
          selectedId={selectedId}
          observacion={observacion}
          setSelectedId={setSelectedId}
          setObservacion={setObservacion}
          handleAceptar={handleAceptar}
          handleRechazar={handleRechazar}
        />
      </div>

      {/* Versión Móvil */}
      <div className="lg:hidden">
        <PadresEstudiantesMobileList 
          pendientes={pendientes}
          selectedId={selectedId}
          observacion={observacion}
          setSelectedId={setSelectedId}
          setObservacion={setObservacion}
          handleAceptar={handleAceptar}
          handleRechazar={handleRechazar}
        />
      </div>

      {/* Estado vacío */}
      {pendientes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay solicitudes pendientes
          </h3>
          <p className="text-gray-500">
            Todas las solicitudes han sido procesadas.
          </p>
        </div>
      )}
    </div>
  );
}