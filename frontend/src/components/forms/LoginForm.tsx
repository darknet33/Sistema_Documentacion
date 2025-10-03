// src/components/LoginForm.tsx
import React from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

interface LoginFormProps {
    email: string;
    password: string;
    loading: boolean;
    error: string | null;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm ({
    email, password, loading, error,
    onEmailChange, onPasswordChange, onSubmit
}:LoginFormProps){
    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => onEmailChange(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => onPasswordChange(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                />
            </div>

            {error && <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Accediendo...
                    </>
                ) : (
                    <>
                        Acceder
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                )}
            </button>
        </form>
    );
};
