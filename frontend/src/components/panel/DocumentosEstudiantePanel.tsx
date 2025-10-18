import { useState } from "react";
import type { EstudianteOut } from "../../types/estudiante";

import { useDocumentosEstudiante } from "../../hooks/useDocumentoEstudiante";
import { DocumentosEstudianteTable } from "../tables/DocumentosEstudianteTable";
import { EntregaDocumentoForm } from "../forms/EntregaDocumentoForm";
import { LoadingScreen } from "../ui/LoadingScreen";

interface Props {
  estudiante: EstudianteOut;
}

export function DocumentosEstudiantePanel({ estudiante }: Props) {
  const {
    documentosCombinados,
    createDocumentoEstudiante,
    deleteDocumentoEstudiante,
    loading,
  } = useDocumentosEstudiante(estudiante.id, estudiante.curso_id);

  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const handleEntregar = (docId: number) => setSelectedDoc(docId);

  const handleSubmitEntrega = async (formData: FormData) => {
    // Se recibe el FormData directamente desde el formulario
    await createDocumentoEstudiante(formData);
    setSelectedDoc(null);
  };

  const handleDeleteEntrega = async (docId: number) => {
    console.log(docId)
    await deleteDocumentoEstudiante(docId);
    setSelectedDoc(null);
  };


  if (loading) return <LoadingScreen/>;

  return (
    <div className="p-4">
      <h5 className="text-xl mb-4">
        <strong className=" text-indigo-600">Estudiante:</strong> {estudiante.nombres} {estudiante.apellidos}
      </h5>
      <h5 className="text-xl mb-4">
        <strong className=" text-indigo-600">Curso:</strong> {estudiante.curso?.nombre} ({estudiante.curso?.nivel})
      </h5>
      <h5 className="text-xl mb-4">
        <strong className=" text-indigo-600">CI:</strong> {estudiante.cedula_identidad}
      </h5>

      <DocumentosEstudianteTable
        documentos={documentosCombinados}
        onEntregar={handleEntregar}
        onDelete={handleDeleteEntrega}
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
