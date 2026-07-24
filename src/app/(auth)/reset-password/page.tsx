"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/api/services/auth.service";
import Link from "next/link";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        try {
            await resetPassword(token, password);
            setSuccess(true);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message || "Le lien est invalide ou a expiré.");
        }
    };

    if (!token) {
        return (
            <div className="login-page">
                <div className="background-overlay" />
                <div className="main-container">
                    <h1 className="page-title">Lien invalide</h1>
                    <div className="form-card">
                        <p className="error-message">Aucun token fourni. Veuillez refaire une demande.</p>
                    </div>
                    <div className="footer-action">
                        <p><Link className="signup-link" href="/forgot-password">Mot de passe oublié</Link></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">Nouveau mot de passe</h1>

                <div className="form-card">
                    {success ? (
                        <div className="success-message">
                            <p>Votre mot de passe a été réinitialisé avec succès.</p>
                            <Link className="success-link-button" href="/signin">Se connecter</Link>
                        </div>
                    ) : (
                        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <PasswordInput
                                label="Nouveau mot de passe"
                                value={password}
                                onChange={setPassword}
                            />

                            <PasswordInput
                                label="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                            />

                            {error && <p className="error-message">{error}</p>}

                            <button className="submit-button" type="submit">
                                Réinitialiser
                            </button>
                        </form>
                    )}
                </div>

                <div className="footer-action">
                    <p><Link className="signup-link" href="/signin">Retour à la connexion</Link></p>
                </div>
            </div>
        </div>
    );
}

