"use client"

import Header from "@/components/profile/Header";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfiles } from "@/api/services/profile.service";
import { Profiles } from "@/types/profiles.types";

export default function ProfilPage () {
    const {logout, token} = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profiles | null>(null);

    useEffect(() => {
        const fetchProfil = async () => {
            if (token) {
                const result = await getProfiles(token);
                const profile = result.data;
                setProfile(profile)

            }
        }
        fetchProfil()
    }, [token])

    const handleLogout = async () => {
        router.push("/signin");
        logout()
    }

    return (
        <>
            <div className="bg-gradient-header"></div>
            {profile && <Header profile={profile} />}
            <ProfileMenu handleLogout={handleLogout} />
        </>
    )
}