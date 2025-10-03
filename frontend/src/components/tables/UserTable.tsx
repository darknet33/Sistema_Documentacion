import { type UserOut } from '../../types/users';

interface Props {
    users: UserOut[];
    onEdit: (user: UserOut) => void;
    onToggle: (user: UserOut) => void;
    onDelete: (user: UserOut) => void;
}

export function UserTable ({ users, onEdit, onToggle, onDelete }:Props){
    return (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.tipo_usuario}</td>
                        <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="px-4 py-2 flex justify-center space-x-2">
                            <button onClick={() => onEdit(user)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Editar</button>
                            <button onClick={() => onToggle(user)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">{user.activo ? 'Desactivar' : 'Activar'}</button>
                            <button onClick={() => onDelete(user)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};