"use client"

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getProfile, updateUserFields } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { calculateMacros, Gender } from "@/utils/tdee.utils";

export default function InformationsPage() {
    const { isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState<Gender>("male");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (isAuthenticated) {
                    const result = await getProfile();
                    const data: Profile = result.data;
                    setProfile(data);
                    setFirstName(data.firstName ?? "");
                    setLastName(data.lastName ?? "");
                    setEmail(data.email ?? "");
                    setGender(data.gender === "female" ? "female" : "male");
                    setAge(data.age != null ? String(data.age) : "");
                    setHeight(data.height != null ? String(data.height) : "");
                    setWeight(data.weight != null ? String(data.weight) : "");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [isAuthenticated]);

    const handleSave = async () => {
        if (!isAuthenticated || !profile) return;
        setSaving(true);
        setSuccess(false);

        const ageNum = age !== "" ? Number(age) : null;
        const heightNum = height !== "" ? Number(height) : null;
        const weightNum = weight !== "" ? Number(weight) : null;

        const fields: Record<string, string | number | undefined | null> = {
            first_name: firstName,
            last_name: lastName,
            email,
            gender,
            age: ageNum,
            height: heightNum,
            weight: weightNum,
        };

        // Recalcule les objectifs caloriques si les données morphologiques sont complètes
        if (
            profile.activity_level &&
            ageNum != null &&
            heightNum != null &&
            weightNum != null
        ) {
            const macros = calculateMacros({
                gender,
                age: ageNum,
                weight: weightNum,
                height: heightNum,
                activity: profile.activity_level,
            });
            fields.daily_calories = macros.calories;
            fields.daily_proteins = macros.proteins;
            fields.daily_carbs = macros.carbs;
            fields.daily_lipids = macros.lipids;
        }

        try {
            await updateUserFields(fields);
            setProfile({
                ...profile,
                firstName,
                lastName,
                email,
                gender,
                age: ageNum,
                height: heightNum,
                weight: weightNum,
            });
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
                        <div className="info-form">
                            <div className="info-row">
                                <div className="info-group">
                                    <label className="info-group__label">Prénom</label>
                                    <input
                                        className="info-box-input"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="info-group">
                                    <label className="info-group__label">Nom</label>
                                    <input
                                        className="info-box-input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="info-group">
                                <label className="info-group__label">Email</label>
                                <input
                                    type="email"
                                    className="info-box-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="info-group">
                                <label className="info-group__label">Genre</label>
                                <div className="gender-toggle">
                                    <button
                                        type="button"
                                        className={`gender-btn${gender === "female" ? " gender-btn--active" : ""}`}
                                        onClick={() => setGender("female")}
                                    >
                                        Femme
                                    </button>
                                    <button
                                        type="button"
                                        className={`gender-btn${gender === "male" ? " gender-btn--active" : ""}`}
                                        onClick={() => setGender("male")}
                                    >
                                        Homme
                                    </button>
                                </div>
                            </div>

                            <div className="info-row">
                                <div className="info-group">
                                    <label className="info-group__label">Âge</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        className="info-box-input"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                                <div className="info-group">
                                    <label className="info-group__label">Taille (cm)</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        className="info-box-input"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    />
                                </div>
                                <div className="info-group">
                                    <label className="info-group__label">Poids (kg)</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        className="info-box-input"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="info-save"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Enregistrement..." : "Enregistrer"}
                            </button>

                            {success && (
                                <p className="save-success">Informations mises à jour !</p>
                            )}
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}
