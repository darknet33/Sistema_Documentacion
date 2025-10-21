import type { ReactNode } from "react";
import { Notification, Sidebar } from "../components";
import { UserInfo } from "../components/ui/UserInfo";

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
      <main className="flex-1 px-5">
        <div className="flex justify-between items-center my-3">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-indigo-700">{title}</h1>
          )}
          <UserInfo/>
        </div>

        <Notification/>

        {children}
      </main>
    </div>
  );
}
