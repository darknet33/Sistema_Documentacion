import { useState } from "react";
import { LoadingScreen, ProfileCard, ProfileForm } from "../components";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import type { UserOut } from "../types/users";
import type { NewProfile, ProfileOut, UpdateProfile } from "../types/profile";
import { PageLayout } from "../layout/PageLayout";
import { useNotification } from "../context/NotificationContext";

function Profile() {
    const { user } = useAuth();
    const { setNotification } = useNotification();

    const [showForm, setShowForm] = useState(false);
    const [editProfile, setEditProfile] = useState<ProfileOut | null>(null);

    const { profile, updateProfile, loading, error } = useProfile(user as UserOut);

    const handleEdit = (profile: ProfileOut) => {
        setEditProfile(profile);
        setShowForm(true);
    };

    const handleSave = async (data: NewProfile | UpdateProfile) => {
        try {
            if (editProfile) {
                await updateProfile(editProfile.id, data as UpdateProfile);
                
                // Actualizar usuario en contexto local
                if (user) {
                    user.perfil = { ...editProfile, ...data };
                }

                setNotification({
                    message: `Perfil de ${data.nombres} actualizado con éxito.`,
                    type: "success",
                });
            }
            setShowForm(false);
        } catch (err: any) {
            console.error(err);
            setNotification({
                message: err?.message || "Error al actualizar el perfil.",
                type: "error",
            });
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    return (
        <PageLayout title="Perfil de Usuario">
            {loading && <LoadingScreen />}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && profile && (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tarjeta de perfil */}
                    <div className="flex-1">
                        <ProfileCard profile={profile} onEdit={handleEdit} />
                    </div>

                    {/* Formulario de edición */}
                    {showForm && editProfile && (
                        <div className="flex-1">
                            <ProfileForm
                                profile={editProfile}
                                onSubmit={handleSave}
                                onCancel={handleCancel}
                            />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
}

export default Profile;
