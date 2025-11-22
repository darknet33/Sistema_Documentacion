import type { ReactNode } from "react";
import { Notification, Sidebar } from "../components";
import { UserInfo } from "../components/ui/UserInfo";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-gray-50 text-black">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 min-w-0">
        {/* Header fijo con padding para evitar superposición */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex justify-between items-center py-4 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              {/* Espacio para el botón hamburguesa en móvil */}
              <div className="w-10 h-10 md:hidden" />
              
              {title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-indigo-700 line-clamp-1">
                  {title}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <UserInfo />
            </div>
          </div>
        </div>

        {/* Contenido con padding ajustado */}
        <div className="p-4 sm:p-6">
          <Notification />
          <div className="mt-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}