// src/components/Sidebar.tsx
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";
import { useMenu } from "../../hooks/useMenu";
import { LoadingScreen } from "./LoadingScreen";
import { UserInfo } from "./UserInfo";
import MenuItems from "./MenuItems";

export function Sidebar() {
    const { user, logout } = useAuth();

    if (!user) return <LoadingScreen />; // seguridad: si user aún es null

    const menus = useMenu(user); // pasamos el usuario al hook

    return (
        <aside className="w-64 bg-white shadow-md flex flex-col justify-between border-r border-gray-200">
            <div>
                <div className="flex items-center justify-center py-3 border-b border-gray-200">
                    <LayoutDashboard className="h-8 w-8 ml-6 text-indigo-600" />
                    <span className="font-bold text-xl text-gray-900 text-center">Sistema Control Documentos</span>
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
                <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-150 shadow-md w-full justify-center"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
