import { type UserOut } from "../types/users";
import { LayoutDashboard, Users, School, GraduationCap, File, Link2, FileCheck2, FileDigit, FileInput } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Ya no necesitamos useEffect
import { usePadreEstudiante } from "../context/PadreEstudianteContext";
import { useDocumentoEstudianteAll } from "./useDocumentoEstudianteAdmin";
import { type JSX } from "react"; // Mover type JSX

export interface MenuItem {
    label: string;
    icon: JSX.Element;
    path?: string;
    onClick?: () => void;
}

export const useMenu = (userData: UserOut): MenuItem[] => {
    const navigate = useNavigate();
    
    // Solo desestructuramos los datos que necesitamos (pendientes y documentosFiltrados)
    const { pendientes } = usePadreEstudiante();
    const { documentosFiltrados } = useDocumentoEstudianteAll();

    // 🧠 Helper para crear ítems de menú
    const createItem = (label: string, icon: JSX.Element, path: string): MenuItem => ({
        label,
        icon,
        path,
        onClick: () => navigate(path),
    });

    // 🧠 Pre-calcular las longitudes para mayor claridad en las plantillas (opcional)
    const countPadresPendientes = pendientes.length;
    const countPorConfirmar = documentosFiltrados?.documentosPorConfirmar?.length ?? 0;
    const countPorVencer = documentosFiltrados?.documentosPorVencer?.length ?? 0;
    const countAprobados = documentosFiltrados?.documentosAprobados?.length ?? 0;


    const menuByRole: Record<string, MenuItem[]> = {
        administrador: [
            createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
            createItem("Usuarios", <Users className="h-5 w-5" />, "/usuarios"),
            createItem("Cursos", <School className="h-5 w-5" />, "/cursos"),
            createItem("Documentos", <File className="h-5 w-5" />, "/documentos"),
            createItem("Estudiantes", <GraduationCap className="h-5 w-5" />, "/estudiantes"),
            {
                label: `Padres - Estudiantes (${countPadresPendientes})`, 
                icon: <Link2 className="h-5 w-5" />,
                path: "/relaciones-pendientes",
                onClick: () => navigate("/relaciones-pendientes"),
            },
            {
                label: `Docs por Confirmar (${countPorConfirmar})`,
                icon: <FileInput className="h-5 w-5" />,
                path: "/documentos-por-confirmar",
                onClick: () => navigate("/documentos-por-confirmar"),
            },
            {
                label: `Docs por Vencer (${countPorVencer})`,
                icon: <FileDigit className="h-5 w-5" />,
                path: "/documentos-por-vencer",
                onClick: () => navigate("/documentos-por-vencer"),
            },
            {
                label: `Docs Aprobados (${countAprobados})`,
                icon: <FileCheck2 className="h-5 w-5" />,
                path: "/documentos-aprobados",
                onClick: () => navigate("/documentos-aprobados"),
            },
        ],

        // ... (Tu rol administrativo es idéntico al de administrador en términos de estructura,
        // por lo que podrías intentar reutilizar la lista o mantenerla separada si difiere en el futuro)

        administrativo: [
            createItem("Dashboard", <LayoutDashboard className="h-5 w-5" />, "/dashboard"),
            createItem("Padres", <Users className="h-5 w-5" />, "/padres"),
            createItem("Estudiantes", <GraduationCap className="h-5 w-5" />, "/estudiantes"),
            {
                label: `Padres - Estudiantes (${countPadresPendientes})`,
                icon: <Link2 className="h-5 w-5" />,
                path: "/relaciones-pendientes",
                onClick: () => navigate("/relaciones-pendientes"),
            },
            {
                label: `Docs por Confirmar (${countPorConfirmar})`,
                icon: <FileInput className="h-5 w-5" />,
                path: "/documentos-por-confirmar",
                onClick: () => navigate("/documentos-por-confirmar"),
            },
            {
                label: `Docs por Vencer (${countPorVencer})`,
                icon: <FileDigit className="h-5 w-5" />,
                path: "/documentos-por-vencer",
                onClick: () => navigate("/documentos-por-vencer"),
            },
            {
                label: `Docs Aprobados (${countAprobados})`,
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