// src/components/Sidebar.tsx
import { useState } from "react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMenu } from "../../hooks/useMenu";
import { LoadingScreen } from "./LoadingScreen";
import MenuItems from "./MenuItems";

export function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return <LoadingScreen />;

  const menus = useMenu(user);

  return (
    <>
      {/* Botón Hamburguesa (visible solo en móvil) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col md:w-64
        `}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Encabezado */}
            <div className="flex items-center justify-center py-3 border-b border-gray-200">
              <LayoutDashboard className="h-8 w-8 ml-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900 text-center ml-2">
                Sistema Control Documentos
              </span>
            </div>

            {/* Menú dinámico */}
            <nav className="flex flex-col gap-1 mt-4 px-4">
              {menus.map((item, index) => (
                <MenuItems key={index} {...item} />
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Fondo semitransparente cuando el menú está abierto en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
