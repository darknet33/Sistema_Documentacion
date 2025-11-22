import { type CurseTableProps, type CurseOut } from '../../types/curse';

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

// Badge de Nivel Compacto
function LevelBadge({ nivel }: { nivel: string }) {
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
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(nivel)}`}>
      {nivel}
    </span>
  );
}

// Acciones Compactas del Curso
function CurseActions({ curse, onEdit, onDelete, onPanel }: { 
  curse: CurseOut; 
  onEdit: (curse: CurseOut) => void; 
  onDelete: (curse: CurseOut) => void;
  onPanel: (curse: CurseOut) => void;
}) {
  return (
    <div className="flex gap-1">
      <button 
        onClick={() => onEdit(curse)} 
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-blue-600"
        title="Editar curso"
      >
        ✏️
      </button>
      <button 
        onClick={() => onPanel(curse)} 
        className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-green-600"
        title="Gestionar documentos"
      >
        📋
      </button>
      <button 
        onClick={() => onDelete(curse)} 
        className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium transition-colors duration-200 hover:bg-red-600"
        title="Eliminar curso"
      >
        🗑️
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil - OPTIMIZADO
// ----------------------------------------------------------------

function CurseCard({ curse, onEdit, onToggle, onDelete, onPanel }: { 
  curse: CurseOut; 
  onEdit: (curse: CurseOut) => void; 
  onToggle: (curse: CurseOut) => void;
  onDelete: (curse: CurseOut) => void;
  onPanel: (curse: CurseOut) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header compacto con nombre, nivel y switch */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate pr-2">
            {curse.nombre}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <LevelBadge nivel={curse.nivel} />
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 hidden xs:inline">Activo</span>
            <ToggleSwitch checked={curse.activo} onChange={() => onToggle(curse)} />
          </div>
        </div>
      </div>

      {/* Acciones en fila separada */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {curse.activo ? '✅ Curso activo' : '⏸️ Curso inactivo'}
        </div>
        <CurseActions 
          curse={curse} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onPanel={onPanel} 
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop - OPTIMIZADO
// ----------------------------------------------------------------

function CurseDesktopTable({ curser, onEdit, onToggle, onDelete, onPanel }: CurseTableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Curso
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nivel
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
          {curser.map(curse => (
            <tr key={curse.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* Columna Curso */}
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">
                  {curse.nombre}
                </div>
              </td>

              {/* Columna Nivel */}
              <td className="px-4 py-3">
                <LevelBadge nivel={curse.nivel} />
              </td>

              {/* Columna Estado */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ToggleSwitch checked={curse.activo} onChange={() => onToggle(curse)} />
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {curse.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </td>

              {/* Columna Acciones */}
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <button 
                    onClick={() => onEdit(curse)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium transition-colors duration-200 hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onPanel(curse)} 
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium transition-colors duration-200 hover:bg-green-600"
                  >
                    Documentos
                  </button>
                  <button 
                    onClick={() => onDelete(curse)} 
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

function CurseMobileList({ curser, onEdit, onToggle, onDelete, onPanel }: CurseTableProps) {
  return (
    <div className="space-y-3">
      {curser.map(curse => (
        <CurseCard 
          key={curse.id} 
          curse={curse}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          onPanel={onPanel}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function CurseTable({ curser, onEdit, onToggle, onDelete, onPanel }: CurseTableProps) {
  return (
    <div>
      {/* Versión Desktop */}
      <div className="hidden sm:block">
        <CurseDesktopTable 
          curser={curser}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          onPanel={onPanel}
        />
      </div>

      {/* Versión Móvil */}
      <div className="sm:hidden">
        <CurseMobileList 
          curser={curser}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          onPanel={onPanel}
        />
      </div>
    </div>
  );
}