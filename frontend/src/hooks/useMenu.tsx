// src/hooks/useMenu.ts
import { type UserOut } from '../types/users';
import { LayoutDashboard, Users, School, GraduationCap,File,Link2 } from 'lucide-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
}

export const useMenu = (userData: UserOut): MenuItem[] => {
  const navigate = useNavigate();

  const menuByRole: Record<string, MenuItem[]> = {
    administrador: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard', onClick: () => navigate('/dashboard') },
      { label: 'Usuarios', icon: <Users className="h-5 w-5" />, path: '/usuarios', onClick: () => navigate('/usuarios') },
      { label: 'Cursos', icon: <School className="h-5 w-5" />, path: '/cursos', onClick: () => navigate('/cursos') },
      { label: 'Documentos', icon: <File className="h-5 w-5" />, path: '/documentos', onClick: () => navigate('/documentos') },
      { label: 'Estudiantes', icon: <GraduationCap className="h-5 w-5" />, path: '/estudiantes', onClick: () => navigate('/estudiantes') },
      { label: 'Relaciones Pendientes', icon: <Link2 className="h-5 w-5" />, path: '/relaciones-pendientes', onClick: () => navigate('/relaciones-pendientes') },
    ],
    administrativo: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard', onClick: () => navigate('/dashboard') },
      { label: 'Relaciones Pendientes', icon: <Link2 className="h-5 w-5" />, path: '/relaciones-pendientes', onClick: () => navigate('/relaciones-pendientes') },
    ],
    padre_familia: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard', onClick: () => navigate('/dashboard') },
      { label: 'Vincular Estudiante', icon: <Link2 className="h-5 w-5" />, path: '/vincular-estudiante', onClick: () => navigate('/vincular-estudiante') },
    ],
  };

  return menuByRole[userData.tipo_usuario] || [];
};
