import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

export function UserInfo() {
  const navigate = useNavigate();
  const {user}=useAuth(); // para refrescar el contexto si es necesario

  return (
    <div
      className="px-3 py-3 border-b border-gray-200 flex flex-col items-center text-center cursor-pointer"
      onClick={() => navigate("/perfil")}
      title="Ver mi perfil"
    >
      <User className="h-16 w-16 text-indigo-600 mb-3" />
      <p className="font-semibold text-lg text-gray-900">{user?.email.split("@")[0]}</p>
      <p className="text-sm text-gray-500 mb-2">{user?.tipo_usuario}</p>

    </div>
  );
}
