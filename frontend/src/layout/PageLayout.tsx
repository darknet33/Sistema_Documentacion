import type { ReactNode } from "react";
import { Sidebar } from "../components";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div
      className="min-h-screen flex transition-colors duration-300 bg-gray-50 text-black"
    >
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mt-5 mb-3">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-indigo-700">{title}</h1>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
