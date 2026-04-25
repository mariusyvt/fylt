"use client"

import { signIn } from "@/api/services/auth.service";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";


export default function SignInForm () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();

    const handleSubmit = async () => {
        try {
            const result = await signIn(email, password);
            login(result.data.token);
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Erreur:", error);
        }
    }

    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">Se connecter</h1>

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
