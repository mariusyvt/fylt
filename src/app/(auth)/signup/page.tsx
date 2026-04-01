"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signUp } from "@/api/services/auth.service";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [typePassword, setTypePassword] = useState("password");
    const [typeConfirm, setTypeConfirm] = useState("password");


    const handleSubmit = async () =>{
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const result = await signUp(lastName, firstName, email, name, password);
            login(result.data.token);

        } catch (error: any) {
            if (error.status === 409){
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
                        <div className="input-group">
                            <label className="input-label">Nom</label>
                            <input
                                className="input-field"
                                type="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Nom"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Prénom</label>
                            <input
                                className="input-field"
                                type="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Prénom"
                            />
                        </div>

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
                        {error && (
                            <p style={{ color: "red", textAlign: "center", marginBottom: "0.25rem", fontSize: 12 }}>
                                {error}
                            </p>
                        )}

                        <div className="input-group input-group--password">
                            <label className="input-label">Mot de passe</label>
                            <div className="input-wrapper">
                                <input
                                    className="input-field"
                                    type={typePassword}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <span className="input-icon" onClick={() => setTypePassword(typePassword === "password" ? "text" : "password")}>
                                    {typePassword === "password" ? <Eye /> : <EyeOff />}
                                </span>
                            </div>
                        </div>

                        <div className="input-group input-group--password">
                            <label className="input-label">Confirmation du mot de passe</label>
                            <div className="input-wrapper">
                            <input
                                className="input-field"
                                type={typeConfirm}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                                <span className="input-icon" onClick={() => setTypeConfirm(typeConfirm === "password" ? "text" : "password")}>
                                    {typeConfirm === "password" ? <Eye /> : <EyeOff />}
                                </span>
                            </div>
                        </div>

                        <div className="link-container">
                            <Link className="forgot-password" href="#">Mot de passe oublié ?</Link>
                        </div>

                        <button
                            className="submit-button"
                            type="submit"
                            onClick={handleSubmit}
                        >
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
