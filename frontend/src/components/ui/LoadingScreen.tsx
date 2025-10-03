// src/components/LoadingScreen.tsx
import { Loader2 } from 'lucide-react';

export function LoadingScreen ({ message = "Cargando..." }:{ message?: string }){
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-lg text-gray-700 font-medium">{message}</p>
        </div>
    );
};

