import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'danger';
  showIcon?: boolean;
  showText?: boolean;
}

export function LogoutButton({ 
  className = "", 
  variant = "default",
  showIcon = true,
  showText = true 
}: LogoutButtonProps) {
    const { logout } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
        } catch (error) {
            console.error('Error durante el logout:', error)
            setLoading(false)
        }
    }

    // Estilos base según la variante
    const getVariantStyles = () => {
        switch (variant) {
            case 'minimal':
                return 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            case 'danger':
                return 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md'
            default:
                return 'bg-white border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50'
        }
    }

    const getSizeStyles = () => {
        if (!showText && showIcon) return 'p-2'
        if (variant === 'minimal') return 'px-3 py-2'
        return 'px-4 py-2'
    }

    const baseStyles = `
        flex items-center justify-center gap-2
        font-medium w-full rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
    `.replace(/\s+/g, ' ').trim()

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={baseStyles}
            aria-label={showText ? undefined : "Cerrar sesión"}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                showIcon && <LogOut className="h-4 w-4" />
            )}
            
            {showText && (
                <span>
                    {loading ? 'Cerrando...' : 'Cerrar sesión'}
                </span>
            )}
        </button>
    )
}

// Componente adicional para confirmación de logout
export function LogoutButtonWithConfirm({ 
  className = "",
  confirmText = "¿Estás seguro de que quieres cerrar sesión?",
  confirmButtonText = "Sí, cerrar sesión",
  cancelButtonText = "Cancelar"
}: {
  className?: string;
  confirmText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) {
    const [showConfirm, setShowConfirm] = useState(false)
    const { logout } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleConfirmLogout = async () => {
        setLoading(true)
        try {
            await logout()
        } catch (error) {
            console.error('Error durante el logout:', error)
            setLoading(false)
        }
    }

    if (showConfirm) {
        return (
            <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}>
                <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <LogOut className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirmar cierre de sesión
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {confirmText}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <LogoutButton
            variant="danger"
            className={className}
        />
    )
}