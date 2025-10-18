import type { ProfileCardProps } from "../../types/profile";


export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Datos
      </h2>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-gray-600">Cedula de Identidad:</span>{" "}
          {profile.cedula_identidad}
        </p>
        <p>
          <span className="font-medium text-gray-600">Nombre Completo:</span>{" "}
          {profile.nombres} {profile.apellidos}
        </p>
        <p>
          <span className="font-medium text-gray-600">Teléfono:</span>{" "}
          {profile.telefono}
        </p>
      </div>
      
      <button
        onClick={() => onEdit?.(profile)}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Editar
      </button>
    </div>
  );
};
