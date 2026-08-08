import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Profile } from "@/types/profile.types";
import { updateProfilePhoto } from "@/api/services/profile.service";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
    profile: Profile;
    onPhotoUpdated?: (newPhotoUrl: string) => void;
}

export default function ProfileHeader ({profile, onPhotoUpdated}: HeaderProps) {
    const photoProfile = (profile.firstName ?? "?").charAt(0).toUpperCase();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        setUploadError(null);

        if (!file.type.startsWith("image/")) {
            setUploadError("Le fichier doit être une image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("L'image ne doit pas dépasser 5 Mo.");
            return;
        }

        try {
            const result = await updateProfilePhoto(token, file);
            onPhotoUpdated?.(result.data?.photo_url);
        } catch (err) {
            console.error("Erreur upload photo:", err);
            setUploadError("Échec de l'envoi de la photo. Réessayez.");
        }
    };

    return (
        <header className="profile-header">
            <div className="avatar-wrapper">
                {profile.photo_url ? (
                    <img
                        className="avatar-circle"
                        src={profile.photo_url}
                        alt={`${profile.firstName} ${profile.lastName}`}
                    />
                ) : (
                    <div className="avatar-circle">{photoProfile}</div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
                <button className="edit-avatar-btn" onClick={handlePhotoClick}>
                    <Camera />
                </button>
            </div>
            <h1 className="user-name">{`${profile.firstName} ${profile.lastName}`}</h1>
            <p className="user-role">Chef Amateur</p>
            {uploadError && <p className="error-message">{uploadError}</p>}
        </header>
    )
}