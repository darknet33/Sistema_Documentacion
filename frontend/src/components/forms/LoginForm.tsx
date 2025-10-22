// src/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

interface FormData {
    email: string;
    password: string;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<FormData>();

    const handleFormSubmit = async (data: FormData) => {
        setIsLoading(true);
        setFormError(null);
        clearErrors();

        try {
            await onSubmit(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setFormError(errorMessage);
            setError('root', { 
                type: 'manual', 
                message: errorMessage 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Campo Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        placeholder="usuario@colegio.edu.bo"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                            errors.email 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        {...register("email", {
                            required: "El correo electrónico es obligatorio",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico inválido"
                            }
                        })}
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo Contraseña */}
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                            errors.password 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message: "La contraseña debe tener al menos 6 caracteres"
                            }
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Error General del Formulario */}
            {(formError || errors.root) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {formError || errors.root?.message}
                    </p>
                </div>
            )}

            {/* Botón de Login */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Iniciando Sesión...
                    </>
                ) : (
                    <>
                        <LogIn className="h-5 w-5" />
                        Iniciar Sesión
                    </>
                )}
            </button>
        </form>
    );
};