// src/components/Sidebar.tsx
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMenu } from "../../hooks/useMenu";
import { LoadingScreen } from "./LoadingScreen";
import { UserInfo } from "./UserInfo";
import MenuItems from "./MenuItems";
import { LogoutButton } from "./LogoutButton";

export function Sidebar() {
  const { user } = useAuth();
  
  if (!user) return <LoadingScreen />; // seguridad: si user aún es null
  
  const menus = useMenu(user); // ✅ siempre llamado
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between border-r border-gray-200">
      <div>
        <div className="flex items-center justify-center py-3 border-b border-gray-200">
          <LayoutDashboard className="h-8 w-8 ml-6 text-indigo-600" />
          <span className="font-bold text-xl text-gray-900 text-center">
            Sistema Control Documentos
          </span>
        </div>

        <UserInfo />

        {/* Menú dinámico */}
        <nav className="flex flex-col gap-1 mt-4 px-4">
          {menus.map((item, index) => (
            <MenuItems key={index} {...item} />
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="px-6 py-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
  );
}
