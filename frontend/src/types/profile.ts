export interface ProfileOut {
    nombres: string;
    apellidos: string;
    telefono: string;
    id: number;
}

export interface NewProfile {
    nombres: string;
    apellidos: string;
    telefono: string;
}

export interface UpdateProfile {
    nombres?: string;
    apellidos?: string;
    telefono?: string;
}

export interface ProfileCardProps {
  profile: ProfileOut;
  onEdit?: (profile: ProfileOut) => void; // función opcional para manejar la edición
}