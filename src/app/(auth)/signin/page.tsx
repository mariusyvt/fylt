"use client"

import { signIn } from "@/api/services/auth.service";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";


export default function SignInForm () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();
    const [type, setType] = useState("password");

    const handleSubmit = async () => {
        try {
            const result = await signIn(email, password);
            login(result.data.token);
            handleClear()
        } catch (error) {
            console.error("Erreur:", error);
        }
    }

    const handleClear = () => {
        setEmail("");
        setPassword("");
    }

    const handleToggle = () => {
        setType(type === "password" ? "text" : "password");
    }


    return (
        <div className="login-page">
            <div className="background-overlay" />
            <div className="main-container">
                <h1 className="page-title">Se connecter</h1>

                <div className="form-card">
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                className="input-field"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="input-group input-group--password">
                            <label className="input-label">Mot de passe</label>
                            <div className="input-wrapper">
                                <input
                                    className="input-field"
                                    type={type}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <span className="input-icon" onClick={handleToggle}>
                                    {type === "password" ? <Eye /> : <EyeOff />}
                                </span>
                            </div>
                        </div>

                        <div className="link-container">
                            <a className="forgot-password" href="#">Mot de passe oublié ?</a>
                        </div>

                        <button
                            className="submit-button"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Se connecter
                        </button>
                    </form>
                </div>

                <div className="footer-action">
                    <p>Tu n&apos;as pas de compte ?<Link className="signup-link" href="/signup">S&apos;inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
