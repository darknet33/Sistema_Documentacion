import type { ProfileCardProps } from "../../types/profile";

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
              {profile.nombres?.charAt(0)}{profile.apellidos?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
              <p className="text-indigo-100 text-sm">Información personal</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Activo"></div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Cédula */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <span className="text-lg">🆔</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Cédula de Identidad</p>
              <p className="text-gray-900 font-semibold">{profile.cedula_identidad}</p>
            </div>
          </div>

          {/* Nombre Completo */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Nombre Completo</p>
              <p className="text-gray-900 font-semibold">
                {profile.nombres} {profile.apellidos}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <span className="text-lg">📞</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Teléfono</p>
              <p className="text-gray-900 font-semibold">{profile.telefono}</p>
            </div>
          </div>
        </div>

        {/* Botón de editar */}
        <button
          onClick={() => onEdit?.(profile)}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
        >
          <span>✏️</span>
          Editar Información
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Última actualización: {new Date().toLocaleDateString('es-BO')}
        </p>
      </div>
    </div>
  );
};