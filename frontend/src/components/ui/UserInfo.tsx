import { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "./LogoutButton";

export function tipoUsuario(tipo_usuario: string) {
  if (tipo_usuario === "administrador") return "Secretaría";
  if (tipo_usuario === "administrativo") return "Plantel Administrativo";
  if (tipo_usuario === "padre_familia") return "Padre / Tutor";
  return "";
}

export function UserInfo() {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative">
      {/* Botón con icono + nombre + tipo */}
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-3 px-4 py-2 border-2 border-indigo-50 rounded-md hover:bg-gray-100 transition "
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">
            {user?.perfil?.nombres} {user?.perfil?.apellidos}
          </p>
          <p className="text-xs text-gray-500">
            {tipoUsuario(user?.tipo_usuario ?? "")}
          </p>
        </div>
        <User className="h-8 w-8 text-indigo-600" />
      </button>

      {/* Menú desplegable */}
      {openMenu && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-md z-50">
          <ul className="text-sm">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <Link to="/perfil" onClick={()=>setOpenMenu(!openMenu)}> Ver Perfil </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
              <LogoutButton />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
