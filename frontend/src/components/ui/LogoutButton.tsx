import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function LogoutButton() {
    const { logout } = useAuth()
    return (
        <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-150 shadow-md w-full justify-center"
        >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
        </button>
    )
}
