import type { CurseOut } from "./curse";
import type { PadresEstudiantesCreate } from "./padresEstudiantes";

export interface EstudianteOut {
  id: number;
  codigo_estudiante: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  curso_id: number;
  curso?: CurseOut;   // 🔹 Ahora es un objeto opcional
  activo: boolean;
}

export interface NewEstudiante {
  codigo_estudiante: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  curso_id: number;
}

export interface UpdateEstudiante {
  nombres?: string;
  apellidos?: string;
  fecha_nacimiento?: string;
  curso_id?: number;
  activo?: boolean;
}

export interface EstudianteFormProps {
  estudiante?: EstudianteOut;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: NewEstudiante | UpdateEstudiante) => void;
  onCancel?: () => void;
}

export interface EstudianteTableProps {
  estudiantes: EstudianteOut[];
  onEdit: (est: EstudianteOut) => void;
  onToggle: (est: EstudianteOut) => void;
  onDelete: (est: EstudianteOut) => void;
}

export interface VincularEstudianteTableProps {
  estudiantes: EstudianteOut[];
  onVincular: (data: PadresEstudiantesCreate) => void;
  onDesvincular: (est: EstudianteOut) => void;
}
