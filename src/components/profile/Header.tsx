import { Camera } from "lucide-react";
import { Profiles } from "@/types/profiles.types";

interface HeaderProps {
    profile: Profiles;
}

export default function Header ({profile}: HeaderProps) {
    const photoProfile = profile.firstName.charAt(0).toUpperCase();

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

                <button className="edit-avatar-btn">
                    <Camera />
                </button>
            </div>
            <h1 className="user-name">{`${profile.firstName} ${profile.lastName}`}</h1>
            <p className="user-role">Chef Amateur</p>
        </header>
    )
}