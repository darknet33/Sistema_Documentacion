// src/hooks/useMenu.ts
import { type UserOut } from "../types/users";
import {
  LayoutDashboard,
  Users,
  School,
  GraduationCap,
  File,
  Link2,
} from "lucide-react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { usePadreEstudiante } from "./usePadeEstudiante";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
}

export const useMenu = (userData: UserOut): MenuItem[] => {
  const navigate = useNavigate();
  const { aceptarRelacion } = usePadreEstudiante();

  // 🧠 Helper para crear ítems de menú
  const createItem = (label: string, icon: JSX.Element, path: string): MenuItem => ({
    label,
    icon,
    path,
    onClick: () => navigate(path),
  });

  const menuByRole: Record<string, MenuItem[]> = {
    administrador: [
      createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
      createItem("Usuarios", <Users className="h-5 w-5" />, "/usuarios"),
      createItem("Cursos", <School className="h-5 w-5" />, "/cursos"),
      createItem("Documentos", <File className="h-5 w-5" />, "/documentos"),
      createItem("Estudiantes", <GraduationCap className="h-5 w-5" />, "/estudiantes"),
      {
        label: `Padres - Estudiantes (${aceptarRelacion?.length ?? 0})`,
        icon: <Link2 className="h-5 w-5" />,
        path: "/relaciones-pendientes",
        onClick: () => navigate("/relaciones-pendientes"),
      },
    ],

    administrativo: [
      createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
      createItem("Padres", <Users className="h-5 w-5" />, "/padres"),
      createItem("Estudiantes", <GraduationCap className="h-5 w-5" />, "/estudiantes"),
      {
        label: `Padres - Estudiantes (${aceptarRelacion?.length ?? 0})`,
        icon: <Link2 className="h-5 w-5" />,
        path: "/relaciones-pendientes",
        onClick: () => navigate("/relaciones-pendientes"),
      },
    ],

    padre_familia: [
      createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
      createItem("Vincular Estudiante", <Link2 className="h-5 w-5" />, "/vincular-estudiante"),
    ],
  };

  // 🔒 fallback si el rol no existe
  return menuByRole[userData.tipo_usuario] ?? [];
};
