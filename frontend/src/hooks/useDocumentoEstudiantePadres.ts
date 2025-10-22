import { useState, useEffect, useMemo } from "react";
import type { DocumentoEstudianteOut, DocumentoCombinado } from "../types/docEstudiante";
import {
  createDocumentoEstudianteApi,
  deleteDocumentoEstudianteApi,
  reenviarDocumentoApi,
  fetchDocumentosEstudiantesByEstudianteApi,
} from "../api/docEstudiante";

import { useDocumentosRequeridos } from "./useDocumentosRequeridos";

export function useDocumentosEstudiante(estudianteId: number, cursoId: number) {
  const [documentosEstudiante, setDocumentosEstudiante] = useState<DocumentoEstudianteOut[]>([]);
  const { requeridos } = useDocumentosRequeridos(cursoId); // se usa para la combinacion de datos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener documentos de un estudiante
  const loadDocumentosRequeridos = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchDocumentosEstudiantesByEstudianteApi(id);
      setDocumentosEstudiante(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear documento
  const createDocumentoEstudiante = async (formData: FormData) => {
    try {
      const newDocumento = await createDocumentoEstudianteApi(formData);
      setDocumentosEstudiante((prev) => [...prev, newDocumento]);
      return newDocumento;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      throw error;
    }
  };

  // 🔹 Eliminar documento
  const deleteDocumentoEstudiante = async (id: number) => {
    try {
      await deleteDocumentoEstudianteApi(id);
      setDocumentosEstudiante((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      throw error;
    }
  };

  // 🔁 Reenviar documento
  const forwardDocumentoEstudiante = async (id: number, archivo: File) => {
    try {
      const updated = await reenviarDocumentoApi(id, archivo)
      setDocumentosEstudiante((prev) =>
        prev.map((doc) => (doc.id === id ? updated : doc))
      )
      return updated
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error al reenviar documento'
      )
      throw error
    }
  }

  // 🔹 Combinar con los documentos requeridos
  const documentosRequeridosPorEstudiante: DocumentoCombinado[] = useMemo(() => {
    if (!requeridos || !documentosEstudiante) return [];
    // 🚀 La lógica de combinación
    return requeridos.map((req) => {
      const entregado = documentosEstudiante.find(
        (doc) => doc.catalogo_documento_id === req.catalogo_documento_id
      );
      return {
        ...req,
        // Convertir el resultado de find a booleano de forma concisa
        entregado: !entregado,
        // Si no se encuentra, es null.
        documento: entregado || null,
      };
    });
  }, [requeridos, documentosEstudiante])

  useEffect(() => {
    if (estudianteId) loadDocumentosRequeridos(estudianteId);
  }, [estudianteId]);

  return {
    documentosEstudiante,
    documentosRequeridosPorEstudiante,
    loading,
    error,
    reload: loadDocumentosRequeridos,
    createDocumentoEstudiante,
    deleteDocumentoEstudiante,
    forwardDocumentoEstudiante
  };
}
