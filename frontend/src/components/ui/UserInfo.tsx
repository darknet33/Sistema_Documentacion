import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "./LogoutButton";
import { tipoUsuario } from "../../helpers/funcionesGenerales";

export function UserInfo() {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú con ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  const userType = tipoUsuario(user?.tipo_usuario ?? "");

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón de usuario - Optimizado para móvil */}
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group w-full sm:w-auto"
      >
        {/* Avatar - Siempre visible */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
          {user?.perfil?.nombres?.charAt(0)}{user?.perfil?.apellidos?.charAt(0)}
        </div>

        {/* Información del usuario - Oculto en móvil, visible en desktop */}
        <div className="hidden sm:block text-left flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[120px]">
            {user?.perfil?.nombres} {user?.perfil?.apellidos}
          </p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userType.color}`}>
            {userType.label}
          </div>
        </div>

        {/* Indicador de menú */}
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            openMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable - Optimizado para móvil */}
      {openMenu && (
        <>
          {/* Overlay para móviles - Mejorado */}
          <div
            className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setOpenMenu(false)}
          />
          
          {/* Menú - Posición responsive */}
          <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white shadow-2xl border border-gray-200 rounded-xl z-50 animate-scale-in max-h-[80vh] overflow-y-auto">
            {/* Header del menú - Solo visible en móvil */}
            <div className="sm:hidden p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.perfil?.nombres?.charAt(0)}{user?.perfil?.apellidos?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {user?.perfil?.nombres} {user?.perfil?.apellidos}
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${userType.color}`}>
                    {userType.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones del menú */}
            <ul className="p-2 space-y-1">
              <li>
                <Link
                  to="/perfil"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200 group"
                >
                  <User className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Mi Perfil</span>
                </Link>
              </li>
            </ul>

            {/* Separador */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Cerrar sesión - Mejorado para móvil */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <LogoutButton 
                variant="minimal"
              />
            </div>

            {/* Footer del menú */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
              <p className="text-xs text-gray-500 text-center">
                Último acceso: {new Date().toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}