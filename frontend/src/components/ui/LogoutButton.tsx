import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function LogoutButton() {
    const { logout } = useAuth()
    return (
        <button
            onClick={logout}
            className="
        flex items-center gap-1 text-sm text-gray-500 
        hover:text-red-500 transition-colors duration-150
      "
        >
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesión</span>
        </button>
    )
}
