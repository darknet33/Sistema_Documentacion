// src/components/tables/PadresEstudiantesTable.tsx
import type { PadresEstudiantesTablePendingProps } from "../../types/padresEstudiantes";

export function PadresEstudiantesTable({
    pendientes,
    selectedId,
    observacion,
    setSelectedId,
    setObservacion,
    handleAceptar,
    handleRechazar,
}: PadresEstudiantesTablePendingProps) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Padres / Tutores
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
                            <strong>Cedula:</strong> {rel.perfil?.cedula_identidad} <br />
                            <strong>Nombre Completo:</strong>{rel.perfil?.nombres + " " + rel.perfil?.apellidos || "Sin nombre"}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                            <strong>Cedula:</strong> {rel.estudiante?.cedula_identidad} <br />
                            <strong>Nombre Completo:</strong> {rel.estudiante?.nombres + " " + rel.estudiante?.apellidos || "Sin nombre"} <br />
                            <strong>Curso:</strong> {rel.estudiante?.curso?.nombre} ({rel.estudiante?.curso?.nivel})
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
    );
}
