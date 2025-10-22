// src/components/MenuItems.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { type MenuItem } from "../../hooks/useMenu";
import { ChevronRight } from "lucide-react";

interface MenuItemsProps extends MenuItem {
    onItemClick?: () => void;
}

function MenuItems({ icon, label, path, onClick, onItemClick }: MenuItemsProps) {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Verifica si la ruta actual coincide con el path del item
    const isActive = path && location.pathname === path;

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (path) {
            navigate(path);
        }
        
        // Cerrar sidebar en móvil después de hacer clic
        if (onItemClick) {
            onItemClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                group relative flex items-center justify-between w-full py-3 px-4 rounded-2xl transition-all duration-300 cursor-pointer
                ${isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]" 
                    : "text-gray-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:border hover:border-gray-200/60"
                }
                overflow-hidden
            `}
        >
            {/* Efecto de fondo para estado activo */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            )}
            
            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <div className="relative z-10 flex items-center gap-3">
                <div className={`
                    flex items-center justify-center transition-all duration-300
                    ${isActive 
                        ? "text-white" 
                        : "text-gray-400 group-hover:text-indigo-600"
                    }
                `}>
                    {icon}
                </div>
                <span className={`
                    font-medium text-left transition-all duration-300
                    ${isActive 
                        ? "text-white font-semibold" 
                        : "group-hover:text-gray-900"
                    }
                `}>
                    {label}
                </span>
            </div>

            {/* Indicador de estado activo */}
            {isActive && (
                <div className="relative z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            )}

            {/* Flecha para hover */}
            {!isActive && (
                <ChevronRight className={`
                    relative z-10 w-4 h-4 transition-all duration-300
                    text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1
                `} />
            )}
        </button>
    );
}

export default MenuItems;