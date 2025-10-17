import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "./LogoutButton";

export function tipoUsuario(tipo_usuario: string) {
    let tipo = "";
    if (tipo_usuario === "administrador") {
        tipo = "Secretaria"
    } else if (tipo_usuario === "administrativo") {
        tipo = "Plantel Administrativo"
    } else if (tipo_usuario === "padre_familia") {
        tipo = "Padre / Tutor"
    }

    return tipo;
}

export function UserInfo() {
  const navigate = useNavigate();
  const {user}=useAuth(); // para refrescar el contexto si es necesario

  return (
    <div className="px-3 py-4 border-b border-gray-200 flex flex-col items-center text-center">
      {/* Perfil */}
      <div
        className="
          flex flex-col items-center cursor-pointer 
          hover:bg-gray-50 rounded-lg p-2 w-full transition
        "
        onClick={() => navigate("/perfil")}
        title="Ver mi perfil"
      >
        <User className="h-16 w-16 text-indigo-600 mb-2" />
        <p className="font-semibold text-lg text-gray-900">
          {`${user?.perfil?.nombres} ${user?.perfil?.apellidos}`}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          {tipoUsuario(user?.tipo_usuario ?? "")}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}
