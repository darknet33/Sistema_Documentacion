import type { ProfileOut } from "./profile";
import type { EstudianteOut } from "./estudiante";

// 🔹 Representa la relación entre un padre/tutor y un estudiante
export interface PadresEstudiantesOut {
  id: number;
  perfil_id: number;
  estudiante_id: number;
  parentesco: string;
  estado: boolean;
  observacion?: string | null;
  perfil: ProfileOut;
  estudiante: EstudianteOut;
  fecha_creacion: string;        // fecha de solicitud
  fecha_actualizacion: string;   // fecha de aceptación (si es diferente)
}

export interface PadresEstudiantesCreate {
  perfil_id: number;
  estudiante_id: number;
  parentesco: string;
  // observacion ya no se envía desde frontend
}

// 🔹 Datos opcionales para actualizar un registro
export interface PadresEstudiantesUpdate {
  perfil_id?: number;
  estudiante_id?: number;
  parentesco?: string;
  estado?: boolean;
  observacion?: string;
}

// 🔹 Props para formulario
export interface PadresEstudiantesFormProps {
  relacion?: PadresEstudiantesOut;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: PadresEstudiantesCreate | PadresEstudiantesUpdate) => void;
  onCancel?: () => void;
}

// 🔹 Props para tabla de relaciones
export interface PadresEstudiantesTableProps {
  relaciones: PadresEstudiantesOut[];
  onEdit: (rel: PadresEstudiantesOut) => void;
  onDelete: (rel: PadresEstudiantesOut) => void;
}

// 🔹 Props para vincular estudiantes a un perfil
export interface VincularPadreEstudianteProps {
  perfilId: number;
  onVincular: (data: PadresEstudiantesCreate) => void;
  onDesvincular: (rel: PadresEstudiantesOut) => void;
}

export interface PadresEstudiantesTablePendingProps {
  pendientes: PadresEstudiantesOut[];
  selectedId: number | null;
  observacion: string;
  setSelectedId: (id: number | null) => void;
  setObservacion: (value: string) => void;
  handleAceptar: (id: number) => void;
  handleRechazar: (id: number) => void;
}
