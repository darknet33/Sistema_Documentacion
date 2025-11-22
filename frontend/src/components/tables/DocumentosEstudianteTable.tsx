import type { DocumentoCombinado } from "../../types/docEstudiante";
import { API_BASE_URL } from "../../config/api";

interface Props {
  documentos: DocumentoCombinado[];
  onEntregar: (docId: number) => void;
  onDelete: (docId: number) => void;
  onReenviar: (id: number) => void;
}

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Componente para valores booleanos
function BooleanBadge({ value }: { value: boolean | null | undefined }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      value 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {value ? '✅ Sí' : '❌ No'}
    </span>
  );
}

/// Badge de Estado de Vencimiento - Versión Mejorada
function ObservacionesBadge({ estado }: { estado: string | null | undefined }) {
  const getVencimientoColor = (estado: string | null | undefined) => {
    // Manejar casos null/undefined
    if (!estado) {
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    }

    const colors = {
      'Vigente': 'bg-green-100 text-green-800 border border-green-200',
      'Próximo a vencer': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Vencido': 'bg-red-100 text-red-800 border border-red-200',
      'Recepcionado y Verificado': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Enviado por Confirmar': 'bg-orange-100 text-orange-800 border border-orange-200',
    };

    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getEstadoDisplay = (estado: string | null | undefined) => {
    if (!estado) return '—';
    
    const displayMap: Record<string, string> = {
      'Vigente': '✅ Vigente',
      'Próximo a vencer': '⚠️ Por Vencer', 
      'Vencido': '❌ Vencido',
      'Recepcionado y Verificado': '✓ Verificado',
      'Enviado por Confirmar': '⏳ Pendiente',
    };

    return displayMap[estado] || estado;
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVencimientoColor(estado)}`}>
      {getEstadoDisplay(estado)}
    </span>
  );
}

// Formateador de fecha
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('es-ES');
}

// Acciones del Documento
function DocumentActions({ doc, onEntregar, onDelete, onReenviar }: { 
  doc: DocumentoCombinado; 
  onEntregar: (docId: number) => void; 
  onDelete: (docId: number) => void;
  onReenviar: (id: number) => void;
}) {
  const hasFile = !!doc.documento?.archivo_digital;
  const hasObservations = !!doc.documento?.observaciones && doc.documento.observaciones !== "";

  if (hasFile) {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={`${API_BASE_URL}${doc.documento!.archivo_digital}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors duration-200 text-center"
        >
          📄 Ver Documento
        </a>
        <button
          onClick={() => onDelete(doc.documento!.id)}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200"
        >
          🗑️ Borrar Entrega
        </button>
      </div>
    );
  }

  if (hasObservations) {
    return (
      <button
        onClick={() => doc.documento?.id && onReenviar(doc.documento.id)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors duration-200 w-full"
      >
        🔄 Reenviar
      </button>
    );
  }

  return (
    <button
      onClick={() => onEntregar(doc.catalogo_documento_id)}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200 w-full"
    >
      📤 Entregar
    </button>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil
// ----------------------------------------------------------------

function DocumentoCard({ doc, onEntregar, onDelete, onReenviar }: { 
  doc: DocumentoCombinado; 
  onEntregar: (docId: number) => void; 
  onDelete: (docId: number) => void;
  onReenviar: (id: number) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header con nombre y estado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {doc.catalogo_documento.nombre}
          </h3>
          {doc.catalogo_documento.descripcion && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {doc.catalogo_documento.descripcion}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 items-end flex-shrink-0">
          <BooleanBadge value={doc.catalogo_documento.es_obligatorio} />
          <BooleanBadge value={doc.entregado} />
        </div>
      </div>

      {/* Información del documento */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Fecha límite:</span>
          <div className="font-medium">{formatDate(doc.fecha_limite)}</div>
        </div>
        <div>
          <span className="text-gray-500">Entrega:</span>
          <div className="font-medium">{formatDate(doc.documento?.fecha_entrega)}</div>
        </div>
        <div>
          <span className="text-gray-500">Vencimiento:</span>
          <div className="font-medium">{formatDate(doc.documento?.fecha_vencimiento)}</div>
        </div>
        <div>
          <span className="text-gray-500">Estado:</span>
          <ObservacionesBadge estado={doc.documento && doc.documento?.observaciones} />
        </div>
      </div>

      {/* Acciones */}
      <DocumentActions 
        doc={doc} 
        onEntregar={onEntregar} 
        onDelete={onDelete} 
        onReenviar={onReenviar} 
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop
// ----------------------------------------------------------------

function DocumentosDesktopTable({ documentos, onEntregar, onDelete, onReenviar }: Props) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
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
              Fecha Límite
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entregado
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
          {documentos.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* Columna Documento */}
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {doc.catalogo_documento.nombre}
                  </div>
                  {doc.catalogo_documento.descripcion && (
                    <div className="text-sm text-gray-600 mt-1 max-w-md">
                      {doc.catalogo_documento.descripcion}
                    </div>
                  )}
                </div>
              </td>

              {/* Columna Obligatorio */}
              <td className="px-4 py-3 text-center">
                <BooleanBadge value={doc.catalogo_documento.es_obligatorio} />
              </td>

              {/* Columna Fecha Límite */}
              <td className="px-4 py-3 text-center text-sm text-gray-900">
                {formatDate(doc.fecha_limite)}
              </td>

              {/* Columna Entregado */}
              <td className="px-4 py-3 text-center">
                <BooleanBadge value={doc.entregado} />
              </td>

              {/* Columna Estado */}
              <td className="px-4 py-3 text-center">
                <ObservacionesBadge estado={doc.documento && doc.documento?.observaciones} />
              </td>

              {/* Columna Acciones */}
              <td className="px-4 py-3">
                <DocumentActions 
                  doc={doc} 
                  onEntregar={onEntregar} 
                  onDelete={onDelete} 
                  onReenviar={onReenviar} 
                />
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

function DocumentosMobileList({ documentos, onEntregar, onDelete, onReenviar }: Props) {
  return (
    <div className="space-y-4">
      {documentos.map((doc) => (
        <DocumentoCard 
          key={doc.id} 
          doc={doc}
          onEntregar={onEntregar}
          onDelete={onDelete}
          onReenviar={onReenviar}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function DocumentosEstudianteTable({ documentos, onEntregar, onDelete, onReenviar }: Props) {
  return (
    <div>
      {/* Versión Desktop */}
      <div className="hidden lg:block">
        <DocumentosDesktopTable 
          documentos={documentos}
          onEntregar={onEntregar}
          onDelete={onDelete}
          onReenviar={onReenviar}
        />
      </div>

      {/* Versión Móvil */}
      <div className="lg:hidden">
        <DocumentosMobileList 
          documentos={documentos}
          onEntregar={onEntregar}
          onDelete={onDelete}
          onReenviar={onReenviar}
        />
      </div>
    </div>
  );
}