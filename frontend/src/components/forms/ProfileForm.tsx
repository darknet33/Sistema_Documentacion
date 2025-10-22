import React from "react";
import { useForm } from "react-hook-form";
import type { ProfileOut, UpdateProfile } from "../../types/profile";
import { capitalizeWords } from "../../helpers/funcionesGenerales";

interface ProfileFormProps {
    profile: ProfileOut;
    onSubmit: (updatedProfile: UpdateProfile) => void;
    onCancel?: () => void;
    loading?: boolean;
}

interface FormData {
    cedula_identidad: string;
    nombres: string;
    apellidos: string;
    telefono: string;
}

export function ProfileForm({ profile, onSubmit, onCancel, loading = false }: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            cedula_identidad: profile.cedula_identidad || "",
            nombres: profile.nombres || "",
            apellidos: profile.apellidos || "",
            telefono: profile.telefono || "",
        }
    });

    const handleFormSubmit = (data: FormData) => {
        const formattedData: UpdateProfile = {
            cedula_identidad: data.cedula_identidad,
            nombres: capitalizeWords(data.nombres),
            apellidos: capitalizeWords(data.apellidos),
            telefono: data.telefono,
        };
        onSubmit(formattedData);
    };

    // Auto-capitalizar nombres y apellidos en tiempo real
    const handleCapitalize = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (field === 'nombres' || field === 'apellidos') {
            setValue(field, capitalizeWords(value), { shouldDirty: true });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full max-w-md"
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                    Editar Perfil
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                    Actualiza tu información personal
                </p>
            </div>

            <div className="space-y-5">
                {/* Cédula de Identidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cedula_identidad">
                        Cédula de Identidad *
                    </label>
                    <input
                        id="cedula_identidad"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200 ${
                            errors.cedula_identidad 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Ingresa tu cédula de identidad"
                        {...register("cedula_identidad", {
                            required: "La cédula de identidad es obligatoria",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "La cédula debe contener solo números"
                            },
                            minLength: {
                                value: 7,
                                message: "La cédula debe tener al menos 5 dígitos"
                            },
                            maxLength: {
                                value: 8,
                                message: "La cédula debe tener al menos 5 dígitos"
                            }
                        })}
                    />
                    {errors.cedula_identidad && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {errors.cedula_identidad.message}
                        </p>
                    )}
                </div>

                {/* Nombres */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="nombres">
                        Nombres *
                    </label>
                    <input
                        id="nombres"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200 ${
                            errors.nombres 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Ingresa tus nombres"
                        {...register("nombres", {
                            required: "Los nombres son obligatorios",
                            minLength: {
                                value: 2,
                                message: "Los nombres deben tener al menos 2 caracteres"
                            },
                            pattern: {
                                value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                                message: "Solo se permiten letras y espacios"
                            }
                        })}
                        onBlur={handleCapitalize('nombres')}
                    />
                    {errors.nombres && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {errors.nombres.message}
                        </p>
                    )}
                </div>

                {/* Apellidos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="apellidos">
                        Apellidos *
                    </label>
                    <input
                        id="apellidos"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200 ${
                            errors.apellidos 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Ingresa tus apellidos"
                        {...register("apellidos", {
                            required: "Los apellidos son obligatorios",
                            minLength: {
                                value: 2,
                                message: "Los apellidos deben tener al menos 2 caracteres"
                            },
                            pattern: {
                                value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                                message: "Solo se permiten letras y espacios"
                            }
                        })}
                        onBlur={handleCapitalize('apellidos')}
                    />
                    {errors.apellidos && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {errors.apellidos.message}
                        </p>
                    )}
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="telefono">
                        Teléfono *
                    </label>
                    <input
                        id="telefono"
                        type="tel"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200 ${
                            errors.telefono 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Ingresa tu número de teléfono"
                        {...register("telefono", {
                            required: "El teléfono es obligatorio",
                            pattern: {
                                value: /^[0-9+-\s()]+$/,
                                message: "Formato de teléfono inválido"
                            },
                            minLength: {
                                value: 6,
                                message: "El teléfono debe tener al menos 6 dígitos"
                            }
                        })}
                    />
                    {errors.telefono && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {errors.telefono.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer con botones */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <span>💾</span>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>

            {/* Indicador de cambios */}
            {!isDirty && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <span>💡</span>
                        Realiza cambios para habilitar el guardado
                    </p>
                </div>
            )}
        </form>
    );
}