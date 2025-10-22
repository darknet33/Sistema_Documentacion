import { useDocumentosRequeridos } from "../../hooks/useDocumentosRequeridos";
import type { CurseOut } from "../../types/curse";
import { useDocument } from "../../hooks/useDocuments";

interface Props {
  curse: CurseOut;
  onClose: () => void;
}

export function DocumentosRequeridosPanel({ curse, onClose }: Props) {
  const { requeridos, toggleRequerido } = useDocumentosRequeridos(curse.id);
  const { documents } = useDocument();

  const isRequerido = (docId: number) =>
    requeridos.some((r) => r.catalogo_documento_id === docId);

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
        Documentos requeridos
      </h2>
      <p className="text-center mb-6 text-gray-600">
        Para el curso <span className="font-semibold">{curse.nombre}</span> ({curse.nivel})
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Documento
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Obligatorio
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Requerido
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {documents?.map((doc) => {
              const requerido = isRequerido(doc.id); // evalua con la funcion isRequerido
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Nombre */}
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {doc.nombre}
                  </td>

                  {/* Obligatorio */}
                  <td className="px-6 py-4 text-center">
                    {doc.es_obligatorio ? (
                      <span className="text-green-600 font-semibold">Sí</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  {/* Switch Requerido */}
                  <td className="px-6 py-4 text-center">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={requerido}
                        onChange={(e) =>
                          toggleRequerido(doc.id, e.target.checked)
                        }
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                      <div className="absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transform transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
