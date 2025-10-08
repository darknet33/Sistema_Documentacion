
import type { ProfileOut, NewProfile, UpdateProfile } from './profile';

export interface UserOut {
    id: number;
    email: string;
    activo: boolean;
    tipo_usuario: 'administrador' | 'administrativo' | 'padre_familia';
    fecha_creacion: string;
    perfil?: ProfileOut; // 👈 agregamos perfil opcional
}

export interface NewUser {
    email: string;
    password: string;
    tipo_usuario: 'administrador' | 'administrativo' | 'padre_familia';
    perfil?: NewProfile; // 👈 agregamos perfil opcional
}

export interface UpdateUser {
    email?: string;
    password?: string;
    tipo_usuario?: 'administrador' | 'administrativo' | 'padre_familia';
    activo?: boolean;
    perfil?: UpdateProfile; // 👈 agregamos perfil opcional
}

export interface UserTableProps {
    users: UserOut[];
    onEdit: (user: UserOut) => void;
    onToggle: (user: UserOut) => void;
    onDelete: (user: UserOut) => void;
}