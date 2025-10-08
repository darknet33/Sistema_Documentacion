import { type NewProfile, type ProfileOut,type UpdateProfile } from "../types/profile";
import { authFetch } from "./authFetch";

export const fetchPerfilApi = async (usuario_id: number): Promise<ProfileOut> => {
    return authFetch(`/perfiles/${usuario_id}`);
};

// Crear usuario
export const createProfileApi = async (profile: NewProfile): Promise<ProfileOut> => {
    return authFetch("/perfiles/", {
        method: "POST",
        body: JSON.stringify(profile),
    });
};

// Actualizar usuario
export const updateProfileApi = async (id: number, profile: UpdateProfile): Promise<ProfileOut> => {
    return authFetch(`/perfiles/${id}`, {
        method: "PUT",
        body: JSON.stringify(profile),
    });
};