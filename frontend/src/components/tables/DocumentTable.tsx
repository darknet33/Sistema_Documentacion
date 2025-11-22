import { type DocumentTableProps, type DocumentOut } from '../../types/document';

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Toggle Switch Compacto
function ToggleSwitch({ 
  checked, 
  onChange, 
  color = 'green' 
}: { 
  checked: boolean; 
  onChange: () => void;
  color?: 'green' | 'orange';
}) {
  const colorClass = color === 'orange' 
    ? 'peer-checked:bg-orange-500' 
    : 'peer-checked:bg-green-500';

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-8 h-4 bg-gray-300 rounded-full peer transition-all duration-200 ${colorClass}`}></div>
      <div className="absolute ml-0.5 w-3 h-3 bg-white rounded-full transform transition-transform duration-200 peer-checked:translate-x-4 shadow-sm"></div>
    </label>
  );
}

// Badge de Estado
function StatusBadge({ obligatorio, activo }: { obligatorio: boolean; activo: boolean }) {
  if (!activo) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        ⏸️ Inactivo
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
      obligatorio 
        ? 'bg-orange-100 text-orange-800 border border-orange-200' 
        : 'bg-blue-100 text-blue-800 border border-blue-200'
    }`}>
      {obligatorio ? '🔴 Obligatorio' : '🔵 Opcional'}
    </span>
  );
}

// Acciones Compactas del Documento
function DocumentActions({ 
  doc, 
  onEdit, 
  onDelete 
}: { 
  doc: DocumentOut; 
  onEdit: (doc: DocumentOut) => void; 
  onDelete: (doc: DocumentOut) => void;
}) {
  return (
    <div className="flex gap-1">
      <button 
        onClick={() => onEdit(doc)} 
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-blue-600"
        title="Editar documento"
      >
        ✏️
      </button>
      <button 
        onClick={() => onDelete(doc)} 
        className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-red-600"
        title="Eliminar documento"
      >
        🗑️
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil - OPTIMIZADO
// ----------------------------------------------------------------

function DocumentCard({ 
  doc, 
  onEdit, 
  onToggleObligatorio, 
  onToggleActivo, 
  onDelete 
}: { 
  doc: DocumentOut; 
  onEdit: (doc: DocumentOut) => void; 
  onToggleObligatorio: (doc: DocumentOut) => void;
  onToggleActivo: (doc: DocumentOut) => void;
  onDelete: (doc: DocumentOut) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header compacto con nombre y estado */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {doc.nombre}
          </h3>
          {doc.descripcion && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {doc.descripcion}
            </p>
          )}
        </div>
        <StatusBadge obligatorio={doc.es_obligatorio} activo={doc.activo} />
      </div>

      {/* Controles de toggle en línea */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Obligatorio:</span>
          <ToggleSwitch 
            checked={doc.es_obligatorio} 
            onChange={() => onToggleObligatorio(doc)}
            color="orange"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Activo:</span>
          <ToggleSwitch 
            checked={doc.activo} 
            onChange={() => onToggleActivo(doc)}
            color="green"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {doc.activo 
            ? (doc.es_obligatorio ? '📋 Documento obligatorio' : '📄 Documento opcional')
            : '⏸️ Documento inactivo'
          }
        </div>
        <DocumentActions 
          doc={doc} 
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

function DocumentDesktopTable({ 
  documentos, 
  onEdit, 
  onToggleObligatorio, 
  onToggleActivo, 
  onDelete 
}: DocumentTableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Obligatorio
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activo
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documentos.map(doc => (
            <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* Columna Documento */}
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {doc.nombre}
                  </div>
                  {doc.descripcion && (
                    <div className="text-sm text-gray-600 mt-1 max-w-md">
                      {doc.descripcion}
                    </div>
                  )}
                </div>
              </td>

              {/* Columna Obligatorio */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ToggleSwitch 
                    checked={doc.es_obligatorio} 
                    onChange={() => onToggleObligatorio(doc)}
                    color="orange"
                  />
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {doc.es_obligatorio ? 'Sí' : 'No'}
                  </span>
                </div>
              </td>

              {/* Columna Activo */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ToggleSwitch 
                    checked={doc.activo} 
                    onChange={() => onToggleActivo(doc)}
                    color="green"
                  />
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {doc.activo ? 'Sí' : 'No'}
                  </span>
                </div>
              </td>

              {/* Columna Acciones */}
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <button 
                    onClick={() => onEdit(doc)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium transition-colors duration-200 hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(doc)} 
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

function DocumentMobileList({ 
  documentos, 
  onEdit, 
  onToggleObligatorio, 
  onToggleActivo, 
  onDelete 
}: DocumentTableProps) {
  return (
    <div className="space-y-3">
      {documentos.map(doc => (
        <DocumentCard 
          key={doc.id} 
          doc={doc}
          onEdit={onEdit}
          onToggleObligatorio={onToggleObligatorio}
          onToggleActivo={onToggleActivo}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function DocumentTable({
  documentos,
  onEdit,
  onToggleObligatorio,
  onToggleActivo,
  onDelete,
}: DocumentTableProps) {
  return (
    <div>
      {/* Versión Desktop */}
      <div className="hidden sm:block">
        <DocumentDesktopTable 
          documentos={documentos}
          onEdit={onEdit}
          onToggleObligatorio={onToggleObligatorio}
          onToggleActivo={onToggleActivo}
          onDelete={onDelete}
        />
      </div>

      {/* Versión Móvil */}
      <div className="sm:hidden">
        <DocumentMobileList 
          documentos={documentos}
          onEdit={onEdit}
          onToggleObligatorio={onToggleObligatorio}
          onToggleActivo={onToggleActivo}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}