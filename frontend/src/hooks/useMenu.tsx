// src/hooks/useMenu.ts
import { type UserOut } from '../types/users';
import { LayoutDashboard, Users, GraduationCap,File } from 'lucide-react';
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
      { label: 'Cursos', icon: <GraduationCap className="h-5 w-5" />, path: '/cursos', onClick: () => navigate('/cursos') },
      { label: 'Documentos', icon: <File className="h-5 w-5" />, path: '/documentos', onClick: () => navigate('/documentos') },
    ],
    administrativo: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard', onClick: () => navigate('/dashboard') },
    ],
    padre_familia: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard', onClick: () => navigate('/dashboard') },
    ],
  };

  return menuByRole[userData.tipo_usuario] || [];
};
