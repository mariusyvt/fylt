"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail, resendVerification } from "@/api/services/auth.service";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">(
        token ? "loading" : "no-token"
    );
    const [email, setEmail] = useState("");
    const [resent, setResent] = useState(false);
    const [resendError, setResendError] = useState("");

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                await verifyEmail(token);
                setStatus("success");
            } catch (err) {
                console.error("❌ Erreur vérification:", err);
                setStatus("error");
            }
        };
        verify();
    }, [token]);

    const handleResend = async () => {
        setResendError("");
        if (!email.trim()) {
            setResendError("Entrez votre adresse email.");
            return;
        }
        try {
            await resendVerification(email);
            setResent(true);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setResendError(e.message || "Une erreur est survenue. Vérifiez votre email.");
        }
    };


    if (status === "loading") {
        return (
            <div className="login-page">
                <div className="background-overlay" />
                <div className="main-container">
                    <h1 className="page-title">Vérification en cours...</h1>
                    <div className="form-card">
                        <div className="success-message">
                            <p>Veuillez patienter pendant que nous vérifions votre adresse email.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="login-page">
                <div className="background-overlay" />
                <div className="main-container">
                    <h1 className="page-title">Email vérifié !</h1>
                    <div className="form-card">
                        <div className="success-message">
                            <p>Votre adresse email a été vérifiée avec succès.</p>
                            <Link className="success-link-button" href="/signin">Se connecter</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">
                    {status === "error" ? "Lien expiré" : "Vérifiez votre email"}
                </h1>

                <div className="form-card">
                    {resent ? (
                        <div className="success-message">
                            <p>Un nouveau lien de vérification a été envoyé à <strong>{email}</strong>.</p>
                            <p>Vérifiez votre boîte de réception.</p>
                        </div>
                    ) : (
                        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleResend(); }}>
                            <p className="form-description">
                                {status === "error"
                                    ? "Le lien est invalide ou a expiré. Entrez votre email pour en recevoir un nouveau."
                                    : "Entrez votre adresse email pour recevoir un lien de vérification."
                                }
                            </p>

                            <TextInput
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="votre@email.com"
                            />

                            {resendError && <p className="error-message">{resendError}</p>}

                            <button className="submit-button" type="submit">
                                Renvoyer le lien
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

