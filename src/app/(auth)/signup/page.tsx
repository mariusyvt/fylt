"use client"

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { signUp } from "@/api/services/auth.service";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";

export default function SignUpForm() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = async () => {
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const result = await signUp(lastName, firstName, email, name, password);
            login(result.data.token);
        } catch (err: unknown) {
            const e = err as { status?: number };
            if (e.status === 409) {
                setError("Cet email est déjà utilisé.");
            } else {
                setError("Une erreur est survenue.");
            }
        }
    }

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">S'inscrire</h1>
                <div className="form-card">
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                        <TextInput
                            label="Nom"
                            value={lastName}
                            onChange={setLastName}
                            placeholder="Nom"
                        />

                        <TextInput
                            label="Prénom"
                            value={firstName}
                            onChange={setFirstName}
                            placeholder="Prénom"
                        />

                        <TextInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="votre@email.com"
                        />

                        <TextInput
                            label="Nom d'utilisateur"
                            value={name}
                            onChange={setName}
                            placeholder="@username"
                        />

                        {error && <p className="error-message">{error}</p>}

                        <PasswordInput
                            label="Mot de passe"
                            value={password}
                            onChange={setPassword}
                        />

                        <PasswordInput
                            label="Confirmation du mot de passe"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />

                        <button className="submit-button" type="submit">
                            S'inscrire
                        </button>
                    </form>
                </div>

                <div className="footer-action">
                    <p>Déjà un compte ?<Link className="signup-link" href="/signin">Se connecter</Link></p>
                </div>
            </div>
        </div>
    )
}
