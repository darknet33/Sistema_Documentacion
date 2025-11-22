// src/api/docEstudiante.ts
import type {
  DocumentoEstudianteOut,
} from "../types/docEstudiante";
import { authFetch } from "./authFetch";


const calcularVencimiento = (data: DocumentoEstudianteOut[]) => {
  // 💡 Optimización: Crear 'hoy' una sola vez y normalizar a medianoche (00:00:00) 
  // para cálculos de diferencia de días más precisos.
  const hoyMedianoche = new Date()
  hoyMedianoche.setHours(0, 0, 0, 0) // Normaliza a inicio del día

  // Define las constantes para los umbrales
  const DIAS_PROXIMO = 7;
  const MS_POR_DIA = 1000 * 60 * 60 * 24;

  return data.map((doc) => {
    if (!doc.fecha_vencimiento) {
      return { ...doc, estadoVencimiento: 'Vigente' }
    }

    // Convierte y normaliza la fecha de vencimiento a medianoche para comparación de días.
    const vencimientoMedianoche = new Date(doc.fecha_vencimiento)
    vencimientoMedianoche.setHours(0, 0, 0, 0)

    // Calcula la diferencia en días.
    const diffDias = Math.floor(
      (vencimientoMedianoche.getTime() - hoyMedianoche.getTime()) / MS_POR_DIA
    )

    // Lógica condensada con operador ternario (opcional para reducir líneas)
    const estadoVencimiento =
      diffDias < 0 ? 'Vencido' :
        diffDias <= DIAS_PROXIMO ? 'Próximo a vencer' :
          'Vigente'

    return { ...doc, estadoVencimiento }
  })
}

// 🔹 Obtener todos los documentos
export const fetchDocumentosEstudiantesApi = async (): Promise<DocumentoEstudianteOut[]> => {
  const data = await authFetch("/documentos_estudiante/");
  return calcularVencimiento(data);
};

// 🔹 Obtener documentos por estudiante
export const fetchDocumentosEstudiantesByEstudianteApi = async (
  estudianteId: number
): Promise<DocumentoEstudianteOut[]> => {
  const data = await authFetch(`/documentos_estudiante/estudiante/${estudianteId}`);
  return data;
};

// 🔹 Crear (entregar) documento
export const createDocumentoEstudianteApi = async (
  formData: FormData
): Promise<DocumentoEstudianteOut> => {
  return authFetch("/documentos_estudiante/", {
    method: "POST",
    body: formData,
  });
};

// 🔹 Eliminar documento
export const deleteDocumentoEstudianteApi = async (
  id: number
): Promise<{ detail: string }> => {
  return authFetch(`/documentos_estudiante/${id}`, {
    method: "DELETE",
  });
};

// 🔁 Reenviar documento
export const reenviarDocumentoApi = async (
  id: number,
  archivo: File
): Promise<DocumentoEstudianteOut> => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return authFetch(`/documentos_estudiante/reenviar/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

// ✅ Aprobar documento
export const aprobarDocumentoApi = async (
  id: number,
  fechaVencimiento?: string // formato 'YYYY-MM-DD'
): Promise<DocumentoEstudianteOut> => {
  const url = fechaVencimiento
    ? `/documentos_estudiante/aprobar/${id}?fecha_vencimiento=${fechaVencimiento}`
    : `/documentos_estudiante/aprobar/${id}`;

  return authFetch(url, { method: "PATCH" });
};


// ❌ Rechazar documento
export const rechazarDocumentoApi = async (
  id: number,
  observacion: string
): Promise<DocumentoEstudianteOut> => {
  const formData = new FormData();
  formData.append("observacion", observacion);

  return authFetch(`/documentos_estudiante/rechazar/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

