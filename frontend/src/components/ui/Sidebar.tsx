// src/components/Sidebar.tsx
import { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
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
        className="md:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm shadow-2xl border-r border-gray-200/60
                    transform transition-all duration-500 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:static md:flex md:flex-col
                    overflow-hidden
                `}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="p-3 border-b border-gray-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 leading-tight">
                  Sistema Control
                </h1>
                <p className="text-sm text-gray-600">Documentos Académicos</p>
              </div>
            </div>

          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menus.map((item, index) => (
              <MenuItems
                key={index}
                {...item}
                onItemClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Efecto de brillo decorativo */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
      </aside>
    </>
  );
}