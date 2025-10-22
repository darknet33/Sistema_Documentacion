// src/components/UserForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, UserPlus, UserCog, Mail, Lock, User, Phone, IdCard, Shield, Eye, EyeOff } from 'lucide-react';
import type { NewUser, UserFormProps } from '../../types/users';
import type { NewProfile } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  tipo_usuario: 'administrador' | 'administrativo' | 'padre_familia';
  cedula_identidad: string;
  nombres: string;
  apellidos: string;
  telefono: string;
}

export function UserForm({
  user,
  loading = false,
  error,
  onSubmit,
  onCancel,
  firstUserMode = false,
}: UserFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: user?.email || '',
      tipo_usuario: (user?.tipo_usuario as 'administrador' | 'administrativo' | 'padre_familia') || 'administrador',
      cedula_identidad: user?.perfil?.cedula_identidad || '',
      nombres: user?.perfil?.nombres || '',
      apellidos: user?.perfil?.apellidos || '',
      telefono: user?.perfil?.telefono || '',
      password: ''
    }
  });

  const handleFormSubmit = (data: FormData) => {
    let submitData: NewUser & { perfil?: NewProfile };

    if (user) {
      // Actualización
      submitData = {
        email: data.email,
        tipo_usuario: data.tipo_usuario,
        password: '', // No se envía password en actualización
        perfil: {
          cedula_identidad: data.cedula_identidad,
          nombres: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono
        }
      };
    } else {
      // Creación
      submitData = {
        email: data.email,
        password: data.password,
        tipo_usuario: data.tipo_usuario,
        perfil: {
          cedula_identidad: data.cedula_identidad,
          nombres: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono
        }
      };
    }

    onSubmit(submitData);

    if (firstUserMode) {
      setTimeout(() => navigate('/login'), 1000);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(firstUserMode ? '/login' : '/users');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  {firstUserMode ? (
                    <UserPlus className="h-6 w-6" />
                  ) : user ? (
                    <UserCog className="h-6 w-6" />
                  ) : (
                    <UserPlus className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-black">
                    {user ? 'Editar Usuario' : firstUserMode ? 'Registrar Administrador' : 'Crear Usuario'}
                  </h1>
                  <p className="text-indigo-100">
                    {firstUserMode 
                      ? 'Configura el primer usuario administrador del sistema' 
                      : 'Completa la información del usuario'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Volver</span>
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">
            {/* Información de Usuario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                Información de Cuenta
              </h3>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="usuario@colegio.edu.bo"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
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

              {/* Contraseña (solo para creación) */}
              {!user && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres"
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: "Debe incluir mayúsculas, minúsculas y números"
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
              )}

              {/* Tipo de Usuario */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Usuario *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-gray-400"
                  {...register("tipo_usuario", {
                    required: "El tipo de usuario es obligatorio"
                  })}
                >
                  <option value="administrador">Secretaría</option>
                  <option value="administrativo">Plantel Administrativo</option>
                  <option value="padre_familia">Padre / Tutor</option>
                </select>
                {errors.tipo_usuario && (
                  <p className="mt-2 text-sm text-red-600">{errors.tipo_usuario.message}</p>
                )}
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                Información Personal
              </h3>

              {/* Cédula de Identidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cédula de Identidad *
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: 12345678"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                      errors.cedula_identidad ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    {...register("cedula_identidad", {
                      required: "La cédula de identidad es obligatoria",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números"
                      },
                      minLength: {
                        value: 5,
                        message: "Mínimo 5 dígitos"
                      }
                    })}
                  />
                </div>
                {errors.cedula_identidad && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.cedula_identidad.message}
                  </p>
                )}
              </div>

              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nombres completos"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                        errors.nombres ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      {...register("nombres", {
                        required: "Los nombres son obligatorios",
                        pattern: {
                          value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                          message: "Solo se permiten letras y espacios"
                        }
                      })}
                    />
                  </div>
                  {errors.nombres && (
                    <p className="mt-2 text-sm text-red-600">{errors.nombres.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Apellidos completos"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                        errors.apellidos ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      {...register("apellidos", {
                        required: "Los apellidos son obligatorios",
                        pattern: {
                          value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
                          message: "Solo se permiten letras y espacios"
                        }
                      })}
                    />
                  </div>
                  {errors.apellidos && (
                    <p className="mt-2 text-sm text-red-600">{errors.apellidos.message}</p>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Ej: 71234567"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
                      errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    {...register("telefono", {
                      pattern: {
                        value: /^[0-9+-\s()]+$/,
                        message: "Formato de teléfono inválido"
                      }
                    })}
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-2 text-sm text-red-600">{errors.telefono.message}</p>
                )}
              </div>
            </div>

            {/* Error General */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {error}
                </p>
              </div>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {user ? 'Actualizando...' : 'Registrando...'}
                </>
              ) : (
                <>
                  {user ? <UserCog className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  {user 
                    ? 'Actualizar Usuario' 
                    : firstUserMode 
                      ? 'Registrar Administrador' 
                      : 'Crear Usuario'
                  }
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}