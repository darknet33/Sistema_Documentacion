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
      {/* Botón de usuario */}
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[120px]">
            {user?.perfil?.nombres} {user?.perfil?.apellidos}
          </p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userType.color}`}>
            {userType.label}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.perfil?.nombres?.charAt(0)}{user?.perfil?.apellidos?.charAt(0)}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openMenu ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {/* Menú desplegable */}
      {openMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-gray-200 rounded-xl z-20 animate-scale-in">
          {/* Opciones del menú */}
          <ul className="p-2 space-y-1">
            <li>
              <Link
                to="/perfil"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors duration-200 group"
              >
                <User className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                <span className="text-sm font-medium">Mi Perfil</span>
              </Link>
            </li>
          </ul>

          {/* Separador */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Cerrar sesión */}
          <div className="flex justify-center p-2">
            <LogoutButton />
          </div>

          {/* Footer del menú */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              Último acceso: Hoy
            </p>
          </div>
        </div>
      )}

      {/* Overlay para móviles */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </div>
  );
}

