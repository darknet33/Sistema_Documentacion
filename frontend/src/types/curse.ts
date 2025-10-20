import type { EstudianteOut } from "./estudiante"
import type { DocumentoRequeridoOut } from "./docRequerido"

export interface CurseOut {
    id: number;
    nombre: string;
    nivel: string;
    activo: boolean;
}

export interface CursosOut {
    id: number;
    nombre: string;
    nivel: string;
    activo: boolean;
    estudiantes: EstudianteOut[],
    documentos_requeridos: DocumentoRequeridoOut[]
}

export interface NewCurse {
    nombre: string;
    nivel: string;
}

export interface UpdateCurse {
    nombre?: string;
    nivel?: string;
    activo?: boolean;
}

export interface CurseTableProps {
    curser: CurseOut[];
    onEdit: (curse: CurseOut) => void;
    onToggle: (curse: CurseOut) => void;
    onDelete: (curse: CurseOut) => void;
    onPanel: (curse: CurseOut) => void;
}

export interface CurseFormProps {
    curse?: CurseOut;                     // si viene, es edición
    loading?: boolean;                  // mostrar estado
    error?: string | null;              // mensaje de error
    onSubmit: (data: NewCurse) => void; // 🔥 Perfil opcional
    onCancel?: () => void;
}