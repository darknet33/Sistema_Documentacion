import { useState, useEffect } from 'react';
import type { DocumentoEstudianteOut, DocumentoCombinado } from '../types/docEstudiante';
import { createDocumentoEstudianteApi, fetchDocumentosEstudiantesByEstudianteApi } from '../api/docEstudiante';
import { useDocumentosRequeridos } from './useDocumentosRequeridos';

export function useDocumentosEstudiante(estudianteId: number, cursoId: number) {
  const { requeridos, loading: loadingReq } = useDocumentosRequeridos(cursoId);
  const [loading, setLoading] = useState(false);
  const [documentosEstudiante, setDocumentosEstudiante] = useState<DocumentoEstudianteOut[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (estudianteId) getDocumentoByIdEstudiante(estudianteId);
  }, [estudianteId]);

  const getDocumentoByIdEstudiante = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchDocumentosEstudiantesByEstudianteApi(id);
      setDocumentosEstudiante(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createDocumentoEstudiante = async (formData: FormData) => {
    try {
      const newDocumento = await createDocumentoEstudianteApi(formData);
      setDocumentosEstudiante(prev => [...prev, newDocumento]);
      return newDocumento;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    }
  };


  const documentosCombinados: DocumentoCombinado[] = requeridos.map((req) => {
    const entregado = documentosEstudiante.find(
      (doc) => doc.catalogo_documento_id === req.catalogo_documento_id
    );
    return {
      ...req,
      entregado: !!entregado,
      documento: entregado || null,
    };
  });


  return {
    documentosEstudiante,
    documentosCombinados,
    loading: loading || loadingReq,
    error,
    getDocumentoByIdEstudiante,
    createDocumentoEstudiante,
  };
}
