import { useState, useEffect } from "react";
import { fetchDocsByCursoApi, createDocReqApi, deleteDocReqApi } from "../api/docRequeridos";
import type { DocumentoRequeridoOut } from "../types/docRequerido";

export const useDocumentosRequeridos = (cursoId: number) => {
  const [requeridos, setRequeridos] = useState<DocumentoRequeridoOut[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchDocsByCursoApi(cursoId);
    setRequeridos(data);
    setLoading(false);
  };

  const toggleRequerido = async (catalogoId: number, isActive: boolean) => {
    const existente = requeridos.find(r => r.catalogo_documento_id === catalogoId);

    if (isActive && !existente) {
      const nuevo = await createDocReqApi({ curso_id: cursoId, catalogo_documento_id: catalogoId });
      setRequeridos(prev => [...prev, nuevo]);
    } else if (!isActive && existente) {
      await deleteDocReqApi(existente.id);
      setRequeridos(prev => prev.filter(r => r.id !== existente.id));
    }
  };

  useEffect(() => {
    load();
  }, [cursoId]);

  return { requeridos, loading, toggleRequerido, reload: load };
};
