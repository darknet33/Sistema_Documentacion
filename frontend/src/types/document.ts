export interface DocumentOut {
  id: number;
  nombre: string;
  descripcion?: string | null;
  es_obligatorio: boolean;
  activo: boolean;
}

export interface NewDocument {
  nombre: string;
  descripcion?: string | null;
  es_obligatorio?: boolean; // opcional (por defecto true en backend)
  activo?: boolean;         // opcional (por defecto true en backend)
}

export interface UpdateDocument {
  nombre?: string;
  descripcion?: string | null;
  es_obligatorio?: boolean;
  activo?: boolean;
}

export interface DocumentTableProps {
  documentos: DocumentOut[];
  onEdit: (doc: DocumentOut) => void;
  onToggleObligatorio: (doc: DocumentOut) => void;
  onToggleActivo: (doc: DocumentOut) => void;
  onDelete: (doc: DocumentOut) => void;
}

export interface DocumentFormProps {
  document?: DocumentOut;              // si viene, es edición
  loading?: boolean;                   // mostrar estado
  error?: string | null;               // mensaje de error
  onSubmit: (data: NewDocument | UpdateDocument) => void;
  onCancel?: () => void;
}
