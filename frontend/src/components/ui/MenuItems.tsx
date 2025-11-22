import { useLocation, useNavigate } from "react-router-dom";
import { type MenuItem } from "../../hooks/useMenu";
import { ChevronRight } from "lucide-react";
import { useMemo, useCallback } from "react";

interface MenuItemsProps extends MenuItem {
    onItemClick?: () => void;
}

function MenuItems({ icon, label, path, onClick, onItemClick }: MenuItemsProps) {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Memoizar la verificación de ruta activa
    const isActive = useMemo(() => 
        path && location.pathname === path, 
        [path, location.pathname]
    );

    // Memoizar el manejador de clic
    const handleClick = useCallback(() => {
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
        
        // Cerrar sidebar en móvil después de hacer clic
        onItemClick?.();
    }, [onClick, path, navigate, onItemClick]);

    // Clases base comunes
    const baseClasses = "group relative flex items-center justify-between w-full py-3 px-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden";
    
    // Clases condicionales para estado activo/hover
    const stateClasses = isActive 
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]"
        : "text-gray-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:border hover:border-gray-200/60";

    // Clases para el icono
    const iconClasses = `flex items-center justify-center transition-all duration-300 ${
        isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
    }`;

    // Clases para el texto
    const textClasses = `font-medium text-left transition-all duration-300 ${
        isActive ? "text-white font-semibold" : "group-hover:text-gray-900"
    }`;

    return (
        <button
            onClick={handleClick}
            className={`${baseClasses} ${stateClasses}`}
        >
            {/* Efecto de fondo para estado activo */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
            
            {/* Efecto de brillo al hover - Solo en desktop para performance */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 hidden md:block" />

            <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                <div className={iconClasses}>
                    {icon}
                </div>
                <span className={`${textClasses} flex-1 truncate`}>
                    {label}
                </span>
            </div>

            {/* Indicadores del lado derecho */}
            <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
                {/* Indicador de estado activo */}
                {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                )}

                {/* Flecha para hover - Solo en desktop */}
                {!isActive && (
                    <ChevronRight className="w-4 h-4 transition-all duration-300 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 hidden sm:block" />
                )}
            </div>
        </button>
    );
}

export default MenuItems;