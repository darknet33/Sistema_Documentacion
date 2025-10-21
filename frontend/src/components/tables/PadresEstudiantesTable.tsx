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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Padre/Tutor
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Estudiante
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Parentesco
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Fecha de Solicitud
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendientes.map((rel) => (
                            <tr key={rel.id} className="hover:bg-gray-50 transition-colors duration-150">
                                {/* Información del Padre/Tutor */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                                            {rel.perfil?.nombres?.charAt(0)}{rel.perfil?.apellidos?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {rel.perfil?.nombres} {rel.perfil?.apellidos || "Sin nombre"}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                CI: {rel.perfil?.cedula_identidad}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Información del Estudiante */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm flex-shrink-0">
                                            {rel.estudiante?.nombres?.charAt(0)}{rel.estudiante?.apellidos?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {rel.estudiante?.nombres} {rel.estudiante?.apellidos}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                CI: {rel.estudiante?.cedula_identidad}
                                            </p>
                                            <p className="text-sm text-blue-600 font-medium mt-1">
                                                {rel.estudiante?.curso?.nombre} ({rel.estudiante?.curso?.nivel})
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Parentesco */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                        👨‍👦 {rel.parentesco}
                                    </span>
                                </td>

                                {/* Fecha */}
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(rel.fecha_creacion).toLocaleString('es-BO', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>

                                {/* Acciones */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAceptar(rel.id)}
                                                className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <span className="mr-1">✅</span>
                                                Aceptar
                                            </button>

                                            {selectedId === rel.id ? (
                                                <button
                                                    onClick={() => setSelectedId(null)}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <span className="mr-1">↶</span>
                                                    Cancelar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedId(rel.id)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <span className="mr-1">❌</span>
                                                    Rechazar
                                                </button>
                                            )}
                                        </div>

                                        {selectedId === rel.id && (
                                            <div className="w-full max-w-xs bg-red-50 border border-red-200 rounded-xl p-4 mt-2">
                                                <label className="block text-sm font-medium text-red-800 mb-2">
                                                    📝 Motivo de rechazo
                                                </label>
                                                <textarea
                                                    placeholder="Ingresa el motivo del rechazo..."
                                                    className="w-full border border-red-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                                    rows={3}
                                                    value={observacion}
                                                    onChange={(e) => setObservacion(e.target.value)}
                                                />
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => handleRechazar(rel.id)}
                                                        disabled={!observacion.trim()}
                                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                                                    >
                                                        <span className="mr-1">🗑️</span>
                                                        Confirmar Rechazo
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Estado vacío */}
            {pendientes.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay solicitudes pendientes
                    </h3>
                    <p className="text-gray-500">
                        Todas las solicitudes han sido procesadas.
                    </p>
                </div>
            )}
        </div>
    );
}