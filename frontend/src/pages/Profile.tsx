import { useState } from "react";
import { LoadingScreen, ProfileCard, ProfileForm, Sidebar } from "../components";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import type { UserOut } from "../types/users";
import type { NewProfile, ProfileOut, UpdateProfile } from "../types/profile";

function Profile() {
    const { user } = useAuth();
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
                alert(`Perfil de ${data.nombres} actualizado con éxito.`);
                if (user && editProfile) {
                    user.perfil = { ...editProfile, ...data };
                }
            }
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Error al procesar la operación.");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Perfil de Usuario</h1>

                {loading && <LoadingScreen />}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && profile && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Tarjeta de perfil */}
                        <div className="flex-1">
                            <ProfileCard profile={profile} onEdit={handleEdit} />
                        </div>

                        {/* Formulario de edición (solo si showForm es true) */}
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
            </main>
        </div>
    );
}

export default Profile;
