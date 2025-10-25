import { useState } from "react";
import { Eye, X } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export function VerDocumentoDocumentoModal({ archivo }: { archivo: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón para abrir modal */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        <Eye className="h-4 w-4" />
        Ver documento
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-[80%] h-[80%] relative">
            
            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 hover:bg-gray-200 p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Contenido: iframe con PDF */}
            <iframe
              src={`${API_BASE_URL}${archivo}`}
              title="Documento"
              className="w-full h-full rounded-b-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
