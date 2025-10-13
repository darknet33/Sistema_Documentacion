import { useState } from "react";
import { Sidebar } from "../components";
import { usePadreEstudiante } from "../hooks/usePadeEstudiante";

export default function RelacionesPendientes() {
  const {
    relaciones,
    loading,
    aceptarRelacion,
    rechazarRelacion,
    reload,
  } = usePadreEstudiante();

  const [observacion, setObservacion] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const pendientes = relaciones.filter(
    (r) => r.observacion === "Solicitado" && !r.estado
  );

  const handleAceptar = async (id: number) => {
    try {
      await aceptarRelacion(id);
      reload();
    } catch (err) {
      console.error("Error al aceptar relación:", err);
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      await rechazarRelacion(id, observacion);
      setSelectedId(null);
      setObservacion("");
      reload();
    } catch (err) {
      console.error("Error al rechazar relación:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Solicitudes de Vinculación
        </h1>

        {loading ? (
          <p className="text-gray-600">Cargando solicitudes...</p>
        ) : pendientes.length === 0 ? (
          <p className="text-gray-600">No hay solicitudes pendientes.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Estudiante
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Parentesco
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha de solicitud
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendientes.map((rel) => (
                  <tr key={rel.id}>
                    <td className="px-4 py-3 text-gray-800">
                      {rel.perfil?.nombres + " " + rel.perfil?.apellidos || "Sin nombre"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {rel.estudiante?.nombres + " " + rel.estudiante?.apellidos || "Sin nombre"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{rel.parentesco}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {new Date(rel.fecha_creacion).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleAceptar(rel.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Aceptar
                      </button>

                      {selectedId === rel.id ? (
                        <div className="flex flex-col mt-2">
                          <textarea
                            placeholder="Motivo de rechazo..."
                            className="border rounded p-2 text-sm mb-2"
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                          />
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleRechazar(rel.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setSelectedId(null)}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedId(rel.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Rechazar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
