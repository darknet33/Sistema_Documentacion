import React, { createContext, useContext } from 'react';
import { useDocumentoEstudianteAll as useDocEstudianteHook } from '../hooks/useDocumentoEstudianteAdmin';
import type { DocEstudianteContextType } from '../types/docEstudiante'; // Importamos la interfaz definida

// 1. Creación del Contexto
// Inicializamos con 'undefined' y tipamos con la interfaz o undefined
const DocumentoEstudianteContext = createContext<DocEstudianteContextType | undefined>(undefined);

// 2. Componente Provider
export const DocumentoEstudianteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Llamamos a tu hook, que contiene toda la lógica de estado y API
    const docEstudianteContextValue = useDocEstudianteHook();

    return (
        <DocumentoEstudianteContext.Provider value={docEstudianteContextValue}>
            {children}
        </DocumentoEstudianteContext.Provider>
    );
};

// 3. Hook de Consumo
// Permite a cualquier componente hijo acceder a los valores del Context
export const useDocumentoEstudiante = (): DocEstudianteContextType => {
    const context = useContext(DocumentoEstudianteContext);
    
    // Verificación obligatoria para asegurar que el hook se use dentro del Provider
    if (!context) {
        throw new Error('useDocumentoEstudiante debe usarse dentro de DocumentoEstudianteProvider');
    }
    
    return context;
};