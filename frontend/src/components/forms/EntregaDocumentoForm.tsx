import { useState } from "react";

interface Props {
  estudianteId: number;
  catalogoDocumentoId: number;
  onSubmit: (formData: FormData) => Promise<void>; // ahora recibe FormData
}

export function EntregaDocumentoForm({ estudianteId, catalogoDocumentoId, onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("estudiante_id", estudianteId.toString());
    formData.append("catalogo_documento_id", catalogoDocumentoId.toString());

    setLoading(true);
    try {
      await onSubmit(formData);
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded shadow-sm">
      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded text-center cursor-pointer hover:border-blue-400"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {file ? <p>{file.name}</p> : <p>Arrastra un documento aquí o haz click para seleccionar</p>}
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Entregar documento"}
      </button>
    </form>
  );
}
