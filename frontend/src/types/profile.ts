export interface ProfileOut {
    cedula_identidad: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    id: number;
}

export interface NewProfile {
    cedula_identidad: string;
    nombres: string;
    apellidos: string;
    telefono: string;
}

export interface UpdateProfile {
    cedula_identidad?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
}

export interface ProfileCardProps {
  profile: ProfileOut;
  onEdit?: (profile: ProfileOut) => void; // función opcional para manejar la edición
}