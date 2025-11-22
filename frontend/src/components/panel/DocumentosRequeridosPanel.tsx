import { useDocumentosRequeridos } from "../../hooks/useDocumentosRequeridos";
import type { CurseOut } from "../../types/curse";
import { useDocument } from "../../hooks/useDocuments";

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Toggle Switch Mejorado
function RequeridoToggle({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all duration-200"></div>
      <div className="absolute ml-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-200 peer-checked:translate-x-6 shadow-sm"></div>
    </label>
  );
}

// Badge de Estado
function EstadoBadge({ 
  value, 
  type = 'obligatorio' 
}: { 
  value: boolean; 
  type?: 'obligatorio' | 'requerido';
}) {
  const config = {
    obligatorio: {
      true: { text: '🔴 Obligatorio', classes: 'bg-red-100 text-red-800 border-red-200' },
      false: { text: '🔵 Opcional', classes: 'bg-blue-100 text-blue-800 border-blue-200' }
    },
    requerido: {
      true: { text: '✅ Requerido', classes: 'bg-green-100 text-green-800 border-green-200' },
      false: { text: '❌ No Requerido', classes: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  };

  const { text, classes } = config[type][value.toString() as 'true' | 'false'];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${classes}`}>
      {text}
    </span>
  );
}

// Componente de Card para Móvil
function DocumentoCard({ 
  doc, 
  requerido, 
  onToggle 
}: { 
  doc: any; // Tipo del documento
  requerido: boolean;
  onToggle: (docId: number, checked: boolean) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header con nombre y estado obligatorio */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 text-base">
            {doc.nombre}
          </h3>
          {doc.descripcion && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {doc.descripcion}
            </p>
          )}
        </div>
        <EstadoBadge value={doc.es_obligatorio} type="obligatorio" />
      </div>

      {/* Control de requerido */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-700 font-medium">
          ¿Requerir este documento?
        </span>
        <RequeridoToggle 
          checked={requerido} 
          onChange={(checked) => onToggle(doc.id, checked)} 
        />
      </div>

      {/* Estado actual */}
      <div className="mt-2 text-center">
        <EstadoBadge value={requerido} type="requerido" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop
// ----------------------------------------------------------------

function DocumentosDesktopTable({ 
  documents, 
  isRequerido, 
  toggleRequerido 
}: { 
  documents: any[];
  isRequerido: (docId: number) => boolean;
  toggleRequerido: (docId: number, checked: boolean) => void;
}) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requerido para el Curso
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => {
            const requerido = isRequerido(doc.id);
            return (
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

                {/* Columna Tipo */}
                <td className="px-4 py-3 text-center">
                  <EstadoBadge value={doc.es_obligatorio} type="obligatorio" />
                </td>

                {/* Columna Requerido */}
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <RequeridoToggle 
                      checked={requerido} 
                      onChange={(checked) => toggleRequerido(doc.id, checked)} 
                    />
                    <EstadoBadge value={requerido} type="requerido" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Lista para Móvil
// ----------------------------------------------------------------

function DocumentosMobileList({ 
  documents, 
  isRequerido, 
  toggleRequerido 
}: { 
  documents: any[];
  isRequerido: (docId: number) => boolean;
  toggleRequerido: (docId: number, checked: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentoCard 
          key={doc.id}
          doc={doc}
          requerido={isRequerido(doc.id)}
          onToggle={toggleRequerido}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Estado Vacío
// ----------------------------------------------------------------

function EmptyState() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
      <div className="text-gray-400 text-5xl mb-4">📄</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay documentos disponibles
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        No se encontraron documentos en el catálogo. Contacte al administrador.
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function DocumentosRequeridosPanel({ curse }: { curse: CurseOut }) {
  const { requeridos, toggleRequerido } = useDocumentosRequeridos(curse.id);
  const { documents } = useDocument();

  const isRequerido = (docId: number) =>
    requeridos.some((r) => r.catalogo_documento_id === docId);

  if (!documents || documents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-4">
      {/* Información del curso */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 text-lg mb-2">
          Configurar Documentos para: {curse.nombre}
        </h3>
        <p className="text-blue-700 text-sm">
          Active los documentos que serán requeridos para los estudiantes de este curso.
        </p>
      </div>

      {/* Versión Desktop */}
      <div className="hidden sm:block">
        <DocumentosDesktopTable 
          documents={documents}
          isRequerido={isRequerido}
          toggleRequerido={toggleRequerido}
        />
      </div>

      {/* Versión Móvil */}
      <div className="sm:hidden">
        <DocumentosMobileList 
          documents={documents}
          isRequerido={isRequerido}
          toggleRequerido={toggleRequerido}
        />
      </div>

      {/* Resumen */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          📊 {requeridos.length} de {documents.length} documentos requeridos para este curso
        </p>
      </div>
    </div>
  );
}