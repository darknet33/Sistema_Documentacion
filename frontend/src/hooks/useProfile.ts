import { useEffect, useState } from "react";
import type { NewProfile, ProfileOut, UpdateProfile } from "../types/profile";
import { createProfileApi, fetchPerfilApi, updateProfileApi } from "../api/profile";
import type { UserOut } from "../types/users";

export const useProfile = (user: UserOut) => {
    const [profile, setProfile] = useState<ProfileOut | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async (id: number) => {
        setLoading(true);
        try {
            const data = await fetchPerfilApi(id);
            setProfile(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const addProfile = async (profile: NewProfile) => {
        const newProfile = await createProfileApi(profile);
        setProfile(newProfile);
        return newProfile;
    };

    const updateProfile = async (id: number, profile: UpdateProfile) => {
        const updated = await updateProfileApi(id, profile);
        setProfile(updated);
        return updated;
    };

    useEffect(() => {
        loadProfile(user.id);
    }, [user]);

    return { profile,addProfile, updateProfile, loading, error, reload: loadProfile };
};
