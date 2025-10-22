// src/context/PadreEstudianteContext.tsx
import React, { createContext, useContext } from 'react';
import { usePadreEstudiante as usePadreHook } from '../hooks/usePadeEstudiante';
import type { PadreEstudianteContextType } from '../types/padresEstudiantes';

const PadreEstudianteContext = createContext<PadreEstudianteContextType | undefined>(undefined);

export const PadreEstudianteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const padreEstudiante = usePadreHook();

    return <PadreEstudianteContext.Provider value={padreEstudiante}>{children}</PadreEstudianteContext.Provider>;
};

export const usePadreEstudiante = (): PadreEstudianteContextType => {
    const context = useContext(PadreEstudianteContext);
    if (!context) throw new Error('usePadreEstudiante debe usarse dentro de PadreEstudianteProvider');
    return context;
};
