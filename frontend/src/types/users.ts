
export interface UserOut {
    id: number;
    email: string;
    activo: boolean;
    tipo_usuario: string;
    fecha_creacion: string;
}

export interface NewUser {
    email: string;
    password: string;
    tipo_usuario: 'administrador' | 'administrativo' | 'padre_familia';
}

export interface UpdateUser {
    email?: string;
    password?: string;
    tipo_usuario?: 'administrador' | 'administrativo' | 'padre_familia';
    activo?: boolean;
}
