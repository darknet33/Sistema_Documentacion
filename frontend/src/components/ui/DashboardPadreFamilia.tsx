import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePadreEstudiante } from "../../hooks/usePadeEstudiante";

export function DashboardPadreFamilia() {
  const { user } = useAuth();

  const {
    relaciones: relacionesIniciales,
    reload,
    loading,
    deleteRelacion,
  } = usePadreEstudiante(user?.perfil?.id);

  const [relaciones, setRelaciones] = useState(relacionesIniciales);
  const [loadingCancel, setLoadingCancel] = useState<number | null>(null);

  useEffect(() => {
    reload();
  }, [user]);

  useEffect(() => {
    setRelaciones(relacionesIniciales);
  }, [relacionesIniciales]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCancelarSolicitud = async (relId: number) => {
    try {
      setLoadingCancel(relId);
      await deleteRelacion(relId);
      setRelaciones((prev) => prev.filter((rel) => rel.id !== relId));
    } catch (err) {
      console.error("Error al cancelar solicitud:", err);
    } finally {
      setLoadingCancel(null);
    }
  };

  // 🔹 Separar relaciones por estado
  const solicitadas = relaciones.filter(
    (rel) => !rel.estado && rel.observacion === "Solicitado"
  );
  const aceptadas = relaciones.filter((rel) => rel.estado);
  const rechazadas = relaciones.filter(
    (rel) => !rel.estado && rel.observacion !== "Solicitado"
  );

  // 🔹 Componente reutilizable de tarjeta
  const RelCard = ({ rel }: { rel: any }) => (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {rel.estudiante.nombres} {rel.estudiante.apellidos}
      </h2>
      <p>
        <strong>Código:</strong> {rel.estudiante.codigo_estudiante}
      </p>
      <p>
        <strong>Curso:</strong> {rel.estudiante.curso?.nombre} (
        {rel.estudiante.curso?.nivel})
      </p>
      <p>
        <strong>Parentesco:</strong> {rel.parentesco}
      </p>
      <p>
        <strong>Estado:</strong>{" "}
        {rel.estado ? (
          <span className="text-green-600 font-medium">{rel.observacion}</span>
        ) : rel.observacion === "Solicitado" ? (
          <span className="text-yellow-600 font-medium">{rel.observacion}</span>
        ) : (
          <span className="text-red-600 font-medium">Rechazado</span>
        )}
      </p>
      <p>
        <strong>Fecha de solicitud:</strong> {formatDate(rel.fecha_creacion)}
      </p>
      {rel.fecha_actualizacion &&
        formatDate(rel.fecha_actualizacion) !== formatDate(rel.fecha_creacion) && (
          <p>
            <strong>Última actualización:</strong>{" "}
            {formatDate(rel.fecha_actualizacion)}
          </p>
        )}

      {/* 🔹 Mostrar observación en caso de rechazo */}
      {!rel.estado && rel.observacion !== "Solicitado" && (
        <p className="mt-2 text-sm text-gray-700">
          <strong>Observación:</strong> {rel.observacion}
        </p>
      )}

      {/* 🔹 Botón para cancelar si está en solicitud */}
      {!rel.estado && rel.observacion !== "Aceptado" && (
        <button
          onClick={() => handleCancelarSolicitud(rel.id)}
          disabled={loadingCancel === rel.id}
          className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loadingCancel === rel.id ? "Cancelando..." : "Cancelar solicitud"}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Mis Estudiantes Vinculados
      </h1>

      {loading ? (
        <p className="text-gray-600">Cargando estudiantes...</p>
      ) : (
        <>
          {/* 🟡 Solicitadas */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
              Solicitudes pendientes
            </h2>
            {solicitadas.length === 0 ? (
              <p className="text-gray-500">No hay solicitudes pendientes.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solicitadas.map((rel) => (
                  <RelCard key={rel.id} rel={rel} />
                ))}
              </div>
            )}
          </section>

          {/* 🟢 Aceptadas */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Estudiantes aceptados
            </h2>
            {aceptadas.length === 0 ? (
              <p className="text-gray-500">No tienes estudiantes aceptados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aceptadas.map((rel) => (
                  <RelCard key={rel.id} rel={rel} />
                ))}
              </div>
            )}
          </section>

          {/* 🔴 Rechazadas */}
          <section>
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Solicitudes rechazadas
            </h2>
            {rechazadas.length === 0 ? (
              <p className="text-gray-500">No hay solicitudes rechazadas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rechazadas.map((rel) => (
                  <RelCard key={rel.id} rel={rel} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
