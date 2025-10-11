import { useState, useEffect } from 'react';
import { 
  fetchDocumentsApi, 
  createDocumentApi, 
  updateDocumentApi, 
  toggleDocumentStatusApi, 
  deleteDocumentApi, 
  toggleDocumentObligatorioApi
} from '../api/document';
import type { DocumentOut, NewDocument, UpdateDocument } from '../types/document';

export const useDocument = () => {
  const [documents, setDocuments] = useState<DocumentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📦 Cargar todos los documentos
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocumentsApi();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ➕ Crear un nuevo documento
  const addDocument = async (doc: NewDocument) => {
    const newDoc = await createDocumentApi(doc);
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  };

  // ✏️ Actualizar documento
  const updateDocument = async (id: number, doc: UpdateDocument) => {
    const updated = await updateDocumentApi(id, doc);
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  };

  // 🔄 Cambiar estado activo/inactivo
  const toggleStatus = async (id: number, activo: boolean) => {
    const updated = await toggleDocumentStatusApi(id, activo);
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  };

    // 🔄 Cambiar estado activo/inactivo
  const toggleObligatorio = async (id: number, obligatorio: boolean) => {
    const updated = await toggleDocumentObligatorioApi(id, obligatorio);
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  };

  // 🗑️ Eliminar documento
  const deleteDocument = async (id: number) => {
    await deleteDocumentApi(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // 🚀 Cargar al montar
  useEffect(() => {
    loadDocuments();
  }, []);

  return { 
    documents, 
    loading, 
    error, 
    addDocument, 
    updateDocument, 
    toggleStatus,
    toggleObligatorio,
    deleteDocument, 
    reload: loadDocuments 
  };
};
