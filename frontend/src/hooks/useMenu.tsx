import { type UserOut } from "../types/users";
import { LayoutDashboard, Users, School, GraduationCap, File, Link2, FileCheck2, FileDigit, FileInput } from "lucide-react";
import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { usePadreEstudiante } from "./usePadeEstudiante";
import { useDocumentoEstudianteAll } from "./useDocumentoEstudianteAll";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
}

export const useMenu = (userData: UserOut): MenuItem[] => {
  const navigate = useNavigate();
  const { pendientes, reload } = usePadreEstudiante();
  const { documentosPorConfirmar, documentosPorVencer, documentosAprobados, load } = useDocumentoEstudianteAll();

  useEffect(() => {
    reload()
    load()
  }, [])


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
        label: `Padres - Estudiantes (${pendientes.length})`, // solo pendientes
        icon: <Link2 className="h-5 w-5" />,
        path: "/relaciones-pendientes",
        onClick: () => navigate("/relaciones-pendientes"),
      },
      {
        label: `Documentos por Confirmar (${documentosPorConfirmar.length})`, // solo pendientes
        icon: <FileInput className="h-5 w-5" />,
        path: "/documentos-por-confirmar",
        onClick: () => navigate("/documentos-por-confirmar"),
      },
      {
        label: `Documentos por Vencer (${documentosPorVencer.length})`, // solo pendientes
        icon: <FileDigit className="h-5 w-5" />,
        path: "/documentos-por-vencer",
        onClick: () => navigate("/documentos-por-vencer"),
      },
      {
        label: `Documentos Aprobados (${documentosAprobados.length})`, // solo pendientes
        icon: <FileCheck2 className="h-5 w-5" />,
        path: "/documentos-aprobados",
        onClick: () => navigate("/documentos-aprobados"),
      },
    ],

    administrativo: [
      createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
      createItem("Padres", <Users className="h-5 w-5" />, "/padres"),
      createItem("Estudiantes", <GraduationCap className="h-5 w-5" />, "/estudiantes"),
      {
        label: `Padres - Estudiantes (${pendientes.length})`,
        icon: <Link2 className="h-5 w-5" />,
        path: "/relaciones-pendientes",
        onClick: () => navigate("/relaciones-pendientes"),
      },
      {
        label: `Documentos por Confirmar (${documentosPorConfirmar.length})`, // solo pendientes
        icon: <FileInput className="h-5 w-5" />,
        path: "/documentos-por-confirmar",
        onClick: () => navigate("/documentos-por-confirmar"),
      },
      {
        label: `Documentos por Vencer (${documentosPorVencer.length})`, // solo pendientes
        icon: <FileDigit className="h-5 w-5" />,
        path: "/documentos-por-vencer",
        onClick: () => navigate("/documentos-por-vencer"),
      },
      {
        label: `Documentos Aprobados (${documentosAprobados.length})`, // solo pendientes
        icon: <FileCheck2 className="h-5 w-5" />,
        path: "/documentos-aprobados",
        onClick: () => navigate("/documentos-aprobados"),
      },
    ],

    padre_familia: [
      createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
      createItem("Solicitud de Vinculo", <Link2 className="h-5 w-5" />, "/vincular-estudiante"),
    ],
  };

  return menuByRole[userData.tipo_usuario] ?? [];
};
