import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { EstudianteOut } from "../../types/estudiante";
import type { PadresEstudiantesCreate } from "../../types/padresEstudiantes";

interface VincularEstudianteFormProps {
  estudiante: EstudianteOut;
  onSubmit: (data: PadresEstudiantesCreate) => void;
  onClose: () => void;
}

export function VincularEstudianteForm({ estudiante, onSubmit, onClose }: VincularEstudianteFormProps) {
  const { user } = useAuth(); // 🔹 perfil desde contexto
  const [parentesco, setParentesco] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentesco || !user?.perfil) return;

    onSubmit({
      perfil_id: user.perfil.id, // 🔹 tomado del contexto
      estudiante_id: estudiante.id,
      parentesco,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Solicitar vínculo con estudiante
        </h2>

        <div className="mb-3">
          <p><strong>Estudiante:</strong> {estudiante.nombres} {estudiante.apellidos} ({estudiante.codigo_estudiante})</p>
          <p><strong>Curso:</strong> {estudiante.curso?.nombre} ({estudiante.curso?.nivel})</p>
          <hr className="my-2" />
          {user?.perfil && (
            <>
              <p><strong>Perfil que solicita:</strong> {user.perfil.nombres} {user.perfil.apellidos}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco
            </label>
            <select
              value={parentesco}
              onChange={(e) => setParentesco(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="" disabled>Seleccione parentesco</option>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tutor">Tutor</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
            >
              Solicitar vínculo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
