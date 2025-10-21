import { useState, useEffect, useCallback } from 'react';
import { fetchCurseApi, createCurseApi, updateCurseApi, toggleCurseStatusApi, deleteCurseApi, fetchCursosApi } from '../api/curse';
import type { CurseOut, CursosOut, NewCurse, UpdateCurse } from '../types/curse';

export const useCurse = () => {
    const [curser, setCurser] = useState<CurseOut[]>([]);
    const [cursosCompleto, setCursosCompleto] = useState<CursosOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Usar useCallback para mantener la misma referencia de la función
    const loadCurser = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchCurseApi();
            const dataComplete = await fetchCursosApi();
            
            // Optimizar: solo actualizar si los datos realmente cambiaron
            setCurser(prev => {
                if (JSON.stringify(prev) === JSON.stringify(data)) {
                    return prev;
                }
                return data;
            });
            
            setCursosCompleto(prev => {
                if (JSON.stringify(prev) === JSON.stringify(dataComplete)) {
                    return prev;
                }
                return dataComplete;
            });
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    const addCurse = async (curse: NewCurse) => {
        const newCurse = await createCurseApi(curse);
        setCurser(prev => [...prev, newCurse]);
        return newCurse;
    };

    const updateCurse = async (id: number, curse: UpdateCurse) => {
        const updated = await updateCurseApi(id, curse);
        setCurser(prev => prev.map(c => c.id === id ? updated : c));
        return updated;
    };

    const toggleStatus = async (id: number, activo: boolean) => {
        const updated = await toggleCurseStatusApi(id, activo);
        setCurser(prev => prev.map(c => c.id === id ? updated : c));
        return updated;
    };

    const deleteCurse = async (id: number) => {
        await deleteCurseApi(id);
        setCurser(prev => prev.filter(c => c.id !== id));
    };

    useEffect(() => {
        loadCurser();
    }, [loadCurser]);

    // Retornar valores estables (mismas referencias)
    return { 
        curser, 
        cursosCompleto, 
        loading, 
        error, 
        addCurse, 
        updateCurse, 
        toggleStatus, 
        deleteCurse, 
        reload: loadCurser 
    };
};