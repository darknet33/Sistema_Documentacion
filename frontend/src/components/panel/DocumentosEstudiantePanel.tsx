import { useState } from "react";
import type { EstudianteOut } from "../../types/estudiante";

import { useDocumentosEstudiante } from "../../hooks/useDocumentoEstudiante";
import { DocumentosEstudianteTable } from "../tables/DocumentosEstudianteTable";
import { EntregaDocumentoForm } from "../forms/EntregaDocumentoForm";

interface Props {
  estudiante: EstudianteOut;
}

export function DocumentosEstudiantePanel({ estudiante }: Props) {
  const {
    documentosCombinados,
    createDocumentoEstudiante,
    loading,
  } = useDocumentosEstudiante(estudiante.id, estudiante.curso_id);

  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const handleEntregar = (docId: number) => setSelectedDoc(docId);

  const handleSubmitEntrega = async (formData: FormData) => {
    // Se recibe el FormData directamente desde el formulario
    await createDocumentoEstudiante(formData);
    setSelectedDoc(null);
  };

  if (loading) return <p>Cargando documentos...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Documentos requeridos de {estudiante.nombres} {estudiante.apellidos}
      </h2>

      <DocumentosEstudianteTable
        documentos={documentosCombinados}
        onEntregar={handleEntregar}
      />

      {selectedDoc && (
        <div className="mt-4">
          <EntregaDocumentoForm
            estudianteId={estudiante.id}
            catalogoDocumentoId={selectedDoc}
            onSubmit={handleSubmitEntrega} // Aquí se maneja el FormData
          />
        </div>
      )}
    </div>
  );
}
