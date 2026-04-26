import { Camera } from "lucide-react";
import { useRef } from "react";
import { Profiles } from "@/types/profiles.types";
import { updateProfilePhoto } from "@/api/services/profile.service";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
    profile: Profiles;
    onPhotoUpdated?: (newPhotoUrl: string) => void;
}

export default function Header ({profile, onPhotoUpdated}: HeaderProps) {
    const photoProfile = profile.firstName.charAt(0).toUpperCase();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        try {
            const result = await updateProfilePhoto(token, file);
            onPhotoUpdated?.(result.data?.photo_url);
        } catch (err) {
            console.error("Erreur upload photo:", err);
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
        </header>
    )
}