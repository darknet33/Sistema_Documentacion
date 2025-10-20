import { useDashboardData } from "../../hooks/useDashboardData";
import { LoadingScreen } from "./LoadingScreen";

export function DashboardAdmin() {

    const { loading, totalEstudiantes, totalDocsRequeridos, totalDocsEntregados, cursos, error } = useDashboardData();

    if (loading) return <LoadingScreen message="Cargando Datos del Dashboard"/>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

    return (
        <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Total Estudiantes</h2>
                    <p className="text-3xl font-bold text-indigo-600">{totalEstudiantes}</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Total Documentos Requeridos</h2>
                    <p className="text-3xl font-bold text-green-600">{totalDocsRequeridos}</p>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Total Documentos Entregados</h2>
                    <p className="text-3xl font-bold text-green-600">{totalDocsEntregados}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Resumen por Curso</h2>

            {cursos.length === 0 ? <h1>Cursos sin asignacion de documentos requeridos.</h1> :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cursos.map(c => (
                        <div key={c.id} className="p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold">{c.nombre} ({c.nivel})</h3>
                            <p>Estudiantes: <span className="font-bold">{c.totalEstudiantes}</span></p>
                            <p>Documentos requeridos: <span className="font-bold">{c.totalDocsRequeridos}</span></p>
                            <p>Documentos requeridos: <span className="font-bold">{c.totalDocsEntregados}</span></p>
                        </div>
                    ))}
                </div>
            }
        </main>
    )
}
