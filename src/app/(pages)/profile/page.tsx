"use client"

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteProfile, getProfile } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";

export default function ProfilPage () {
    const {logout, token} = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfil = async () => {
            if (token) {
                const result = await getProfile(token);
                const profile = result.data;
                setProfile(profile)
            }
        }
        fetchProfil()
    }, [token])

    const handleLogout = async () => {
        logout();
        router.push("/signin");
    }

    const handleDeleteAccount = async () => {
        if (token) {
            await deleteProfile(token);
            logout();
            router.push("/signin");
        }
    }

    return (
        <>
            <div className="bg-gradient-header"></div>
            {profile && (
                <ProfileHeader
                    profile={profile}
                    onPhotoUpdated={(url) => setProfile({ ...profile, photo_url: url })}
                />
            )}
            <ProfileMenu handleLogout={handleLogout} handleDeleteAccount={handleDeleteAccount} />
        </>
    )
}