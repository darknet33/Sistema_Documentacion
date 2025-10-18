import React, { useState, useEffect } from "react";
import type { ProfileOut, UpdateProfile } from "../../types/profile";

interface ProfileFormProps {
    profile: ProfileOut;
    onSubmit: (updatedProfile: UpdateProfile) => void;
    onCancel?: () => void;
}

export function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState<ProfileOut>(profile);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full max-w-md"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Editar Perfil
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="cedula_identidad">
                        Cedula de Identidad
                    </label>
                    <input
                        id="cedula_identidad"
                        name="cedula_identidad"
                        type="text"
                        value={formData.cedula_identidad}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="nombres">
                        Nombres
                    </label>
                    <input
                        id="nombres"
                        name="nombres"
                        type="text"
                        value={formData.nombres}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="apellidos">
                        Apellidos
                    </label>
                    <input
                        id="apellidos"
                        name="apellidos"
                        type="text"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="telefono">
                        Teléfono
                    </label>
                    <input
                        id="telefono"
                        name="telefono"
                        type="text"
                        value={formData.telefono || ""}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition cursor-pointer"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
