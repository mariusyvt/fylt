"use client"

import { signIn } from "@/api/services/auth.service";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { CircleCheck, AlertCircle } from "lucide-react";


export default function SignInForm () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified") === "true";
    const verificationFailed = searchParams.get("error") === "verification_failed";

    const handleSubmit = async () => {
        setError("");
        try {
            await signIn(email, password);
            login();
            setEmail("");
            setPassword("");
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            if (e.status === 403) {
                setError("Veuillez vérifier votre email avant de vous connecter.");
            } else {
                setError(e.message || "Email ou mot de passe incorrect.");
            }
        }
    }

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">Se connecter</h1>

                {verified && (
                    <div className="verified-banner">
                        <CircleCheck size={18} />
                        <span>Votre email a été vérifié avec succès !</span>
                    </div>
                )}

                {verificationFailed && (
                    <div className="error-banner">
                        <AlertCircle size={18} />
                        <span>Le lien de vérification est invalide ou a expiré.</span>
                    </div>
                )}

                <div className="form-card">
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                        <TextInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="votre@email.com"
                        />

                        <PasswordInput
                            label="Mot de passe"
                            value={password}
                            onChange={setPassword}
                        />

                        <div className="link-container">
                            <Link className="forgot-password" href="/forgot-password">Mot de passe oublié ?</Link>
                        </div>

                        {error && (
                            <p className="error-message">
                                {error}
                                {error.includes("vérifier votre email") && (
                                    <> <Link className="forgot-password" href="/verify-email">Renvoyer le lien</Link></>
                                )}
                            </p>
                        )}

                        <button className="submit-button" type="submit">
                            Se connecter
                        </button>
                    </form>
                </div>

                <div className="footer-action">
                    <p>Tu n&apos;as pas de compte ?<Link className="signup-link" href="/signup">S&apos;inscrire</Link></p>
                </div>
            </div>
        </div>
    )
}
