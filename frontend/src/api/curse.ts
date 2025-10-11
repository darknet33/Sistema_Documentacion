import type {CurseOut,NewCurse,UpdateCurse} from '../types/curse'
import { authFetch } from './authFetch';


// Obtener todos los usuarios
export const fetchCurseApi = async (): Promise<CurseOut[]> => {
    return authFetch("/cursos/");
};

// Crear curso
export const createCurseApi = async (user: NewCurse): Promise<CurseOut> => {
    return authFetch("/cursos/", {
        method: "POST",
        body: JSON.stringify(user),
    });
};

// Actualizar curso
export const updateCurseApi = async (id: number,user: UpdateCurse): Promise<CurseOut> => {
    return authFetch(`/cursos/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
};

// Eliminar usuario
export const deleteCurseApi = async (id: number): Promise<void> => {
    return authFetch(`/cursos/${id}`, {
        method: "DELETE",
    });
};

// Cambiar estado
export const toggleCurseStatusApi = async (id: number, activo: boolean): Promise<CurseOut> => {
    return authFetch(`/cursos/${id}/status?activo=${activo}`, {
        method: "PATCH",
    });
};