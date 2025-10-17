import { type UserTableProps } from '../../types/users';
import { tipoUsuario } from '../ui/UserInfo';
export function UserTable({ users, onEdit, onToggle, onDelete }: UserTableProps) {
  return (
    <div>
      {/* ---------- Desktop: Tabla ---------- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-center">Activo</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-2 font-medium text-gray-800">
                  {user.perfil ? `${user.perfil.nombres} ${user.perfil.apellidos}` : '—'}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.perfil?.telefono || '—'}</td>
                <td className="px-4 py-2">{tipoUsuario(user.tipo_usuario)}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.activo}
                    onChange={() => onToggle(user)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                  <div className="absolute ml-1 w-4 h-4 bg-white rounded-full transform transition-transform peer-checked:translate-x-5"></div>
                </td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button onClick={() => onEdit(user)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Editar</button>
                  <button onClick={() => onDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Móvil: Cards ---------- */}
      <div className="sm:hidden flex flex-col space-y-4">
        {users.map(user => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            <p className="font-medium text-gray-800">
              {user.perfil ? `${user.perfil.nombres} ${user.perfil.apellidos}` : '—'}
            </p>
            <p>Email: {user.email}</p>
            <p>Teléfono: {user.perfil?.telefono || '—'}</p>
            <p>Tipo: {tipoUsuario(user.tipo_usuario)}</p>
            <p>
              Activo: 
              <input
                type="checkbox"
                className="ml-2"
                checked={user.activo}
                onChange={() => onToggle(user)}
              />
            </p>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => onEdit(user)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Editar</button>
              <button onClick={() => onDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
