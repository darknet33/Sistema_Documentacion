// src/api/users.ts
import { type NewUser, type UpdateUser, type UserOut } from "../types/users";
import { authFetch } from "./authFetch";

// Obtener todos los usuarios
export const fetchUsersApi = async (): Promise<UserOut[]> => {
    return authFetch("/users/");
};

// Crear usuario
export const createUserApi = async (user: NewUser): Promise<UserOut> => {
    return authFetch("/users/", {
        method: "POST",
        body: JSON.stringify(user),
    });
};

// Actualizar usuario
export const updateUserApi = async (id: number, user: UpdateUser): Promise<UserOut> => {
    return authFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
};

// Cambiar estado
export const toggleUserStatusApi = async (id: number, activo: boolean): Promise<UserOut> => {
    return authFetch(`/users/${id}/status?activo=${activo}`, {
        method: "PATCH",
    });
};

// Eliminar usuario
export const deleteUserApi = async (id: number): Promise<void> => {
    return authFetch(`/users/${id}`, {
        method: "DELETE",
    });
};
