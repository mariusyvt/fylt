"use client"

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default function InformationsPage() {
    const { token } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (token) {
                    const result = await getProfile(token);
                    setProfile(result.data);
                    setFirstName(result.data.firstName);
                    setLastName(result.data.lastName);
                    setEmail(result.data.email);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const hasChanges = profile && (
        firstName !== profile.firstName ||
        lastName !== profile.lastName ||
        email !== profile.email
    );

    const handleSave = async () => {
        if (!token || !profile || !hasChanges) return;
        setSaving(true);
        setSuccess(false);
        try {
            await updateProfile(token, { firstName, lastName, email });
            setProfile({ ...profile, firstName, lastName, email });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error("Erreur mise à jour:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="informations-page">
            <div className="bg-gradient-header"></div>

            <header className="informations-header">
                <Link className="circle-btn" href="/profile">
                    <ArrowLeft />
                </Link>
                <h1 className="informations-title">Mes informations</h1>
            </header>

            {profile && (
                <>
                    <ProfileHeader
                        profile={profile}
                        onPhotoUpdated={(url) => setProfile({ ...profile, photo_url: url })}
                    />

                    <main className="informations-content">
                        <div className="info-card">
                            <div className="info-field">
                                <label className="info-label">Prénom</label>
                                <input
                                    className="info-input"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="info-divider" />

                            <div className="info-field">
                                <label className="info-label">Nom</label>
                                <input
                                    className="info-input"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="info-divider" />
                        </div>

                        {hasChanges && (
                            <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Enregistrement..." : (
                                    <><Check size={18} /> Enregistrer</>
                                )}
                            </button>
                        )}

                        {success && (
                            <p className="save-success">Informations mises à jour !</p>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}
