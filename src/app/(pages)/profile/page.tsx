"use client"

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteProfile, getProfile } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";
import Loader from "@/components/Loader";
import { UtensilsCrossed } from "lucide-react";

export default function ProfilPage () {
    const {logout, isAuthenticated} = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchProfil = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getProfile();
                setProfile(result.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Impossible de charger le profil.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfil();
    }, [isAuthenticated])

    const handleLogout = async () => {
        logout();
        router.push("/signin");
    }

    const handleDeleteAccount = async () => {
        if (isAuthenticated) {
            await deleteProfile();
            logout();
            router.push("/signin");
        }
    }

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="page-shell">
                <div className="bg-gradient-decor"></div>
                <div className="empty-state">
                    <UtensilsCrossed size={48} />
                    <h2>Oups…</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
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