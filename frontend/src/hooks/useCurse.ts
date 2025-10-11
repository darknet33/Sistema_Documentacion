import { useState, useEffect } from 'react';
import { fetchCurseApi, createCurseApi, updateCurseApi, toggleCurseStatusApi, deleteCurseApi } from '../api/curse';
import type { CurseOut, NewCurse, UpdateCurse } from '../types/curse';

export const useCurse = () => {
    const [curser, setCurser] = useState<CurseOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCurser = async () => {
        setLoading(true);
        try {
            const data = await fetchCurseApi();
            setCurser(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

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

    const deleteCurse= async (id: number) => {
        await deleteCurseApi(id);
        setCurser(prev => prev.filter(c => c.id !== id));
    };

    useEffect(() => {
        loadCurser();
    }, []);

    return { curser, loading, error, addCurse, updateCurse, toggleStatus, deleteCurse, reload: loadCurser };
};
