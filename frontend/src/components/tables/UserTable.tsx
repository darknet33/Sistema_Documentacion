import { tipoUsuario } from '../../helpers/funcionesGenerales';
import { type UserOut, type UserTableProps } from '../../types/users';

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Toggle Switch Reutilizable
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all duration-200"></div>
      <div className="absolute ml-0.5 w-5 h-5 bg-white rounded-full transform transition-transform duration-200 peer-checked:translate-x-5 shadow-sm"></div>
    </label>
  );
}

// Badge de Tipo de Usuario
function UserTypeBadge({ tipoUsuario: tipo }: { tipoUsuario: string }) {
  const userType = tipoUsuario(tipo);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userType.color}`}>
      {userType.label}
    </span>
  );
}

// Acciones de Usuario
function UserActions({ user, onEdit, onDelete }: { user: UserOut; onEdit: (user: UserOut) => void; onDelete: (user: UserOut) => void }) {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onEdit(user)} 
        className="flex-1 sm:flex-none px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Editar
      </button>
      <button 
        onClick={() => onDelete(user)} 
        className="flex-1 sm:flex-none px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Eliminar
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Card para Móvil
// ----------------------------------------------------------------

function UserCard({ user, onEdit, onToggle, onDelete }: { user: UserOut; onEdit: (user: UserOut) => void; onToggle: (user: UserOut) => void; onDelete: (user: UserOut) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header con nombre y tipo */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {user.perfil ? `${user.perfil.nombres} ${user.perfil.apellidos}` : 'Sin nombre'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            CI: {user.perfil?.cedula_identidad || 'No registrada'}
          </p>
        </div>
        <UserTypeBadge tipoUsuario={user.tipo_usuario} />
      </div>

      {/* Información de contacto */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">📧</span>
          <span className="text-gray-700 truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">📱</span>
          <span className="text-gray-700">{user.perfil?.telefono || 'No registrado'}</span>
        </div>
      </div>

      {/* Estado y acciones */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Activo:</span>
          <ToggleSwitch checked={user.activo} onChange={() => onToggle(user)} />
        </div>
        <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente de Tabla para Desktop
// ----------------------------------------------------------------

function UserDesktopTable({ users, onEdit, onToggle, onDelete }: UserTableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* Columna Usuario */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900">
                    {user.perfil ? `${user.perfil.nombres} ${user.perfil.apellidos}` : '—'}
                  </div>
                  <div className="text-sm text-gray-500">
                    CI: {user.perfil?.cedula_identidad || '—'}
                  </div>
                </div>
              </td>

              {/* Columna Contacto */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.perfil?.telefono || '—'}</div>
              </td>

              {/* Columna Tipo */}
              <td className="px-6 py-4 whitespace-nowrap">
                <UserTypeBadge tipoUsuario={user.tipo_usuario} />
              </td>

              {/* Columna Estado */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <ToggleSwitch checked={user.activo} onChange={() => onToggle(user)} />
              </td>

              {/* Columna Acciones */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />
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

function UserMobileList({ users, onEdit, onToggle, onDelete }: UserTableProps) {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
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

export function UserTable({ users, onEdit, onToggle, onDelete }: UserTableProps) {
  return (
    <div>
      {/* Versión Desktop */}
      <div className="hidden sm:block">
        <UserDesktopTable 
          users={users} 
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>

      {/* Versión Móvil */}
      <div className="sm:hidden">
        <UserMobileList 
          users={users} 
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}