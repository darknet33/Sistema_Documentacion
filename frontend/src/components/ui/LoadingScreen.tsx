// src/components/LoadingScreen.tsx
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message = "Cargando..." }: LoadingScreenProps) {
    return (
        <div
            className="flex flex-col items-center justify-center w-full h-full"
        >
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
            {message && <p className="text-sm text-gray-700 font-medium">{message}</p>}
        </div>
    );
}
