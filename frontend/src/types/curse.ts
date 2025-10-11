export interface CurseOut{
    nombre: string;
    nivel: string;
    activo: boolean;
    id: number;
}

export interface NewCurse{
    nombre: string;
    nivel: string;
}

export interface UpdateCurse{
    nombre?: string;
    nivel?: string;
    activo?: boolean;
}

export interface CurseTableProps {
    curser: CurseOut[];
    onEdit: (user: CurseOut) => void;
    onToggle: (user: CurseOut) => void;
    onDelete: (user: CurseOut) => void;
}

export interface CurseFormProps {
  curse?: CurseOut;                     // si viene, es edición
  loading?: boolean;                  // mostrar estado
  error?: string | null;              // mensaje de error
  onSubmit: (data: NewCurse) => void; // 🔥 Perfil opcional
  onCancel?: () => void;
}