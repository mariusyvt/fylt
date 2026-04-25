"use client"

import { useState } from "react";
import { forgotPassword } from "@/api/services/auth.service";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");
        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch {
            setError("Une erreur est survenue. Vérifiez votre email.");
        }
    };

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">Mot de passe oublié</h1>

                <div className="form-card">
                    {success ? (
                        <div className="success-message">
                            <p>Un email de réinitialisation a été envoyé à <strong>{email}</strong>.</p>
                            <p>Vérifiez votre boîte de réception.</p>
                        </div>
                    ) : (
                        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <p className="form-description">
                                Entrez votre adresse email pour recevoir un lien de réinitialisation.
                            </p>

                            <TextInput
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="votre@email.com"
                            />

                            {error && <p className="error-message">{error}</p>}

                            <button className="submit-button" type="submit">
                                Envoyer le lien
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

