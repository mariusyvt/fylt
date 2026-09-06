"use client"

import { useState } from "react";
import { signUp } from "@/api/services/auth.service";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";
import SelectField from "@/components/ui/SelectField";
import { MailCheck } from "lucide-react";
import { FieldError } from "@/types/api.types";

const GENDER_OPTIONS = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" },
    { value: "other", label: "Autre" },
];


export default function SignUpForm() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [registered, setRegistered] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setFieldErrors({});

        if (password !== confirmPassword) {
            setFieldErrors({ password: "Les mots de passe ne correspondent pas." });
            return;
        }
        try {
            await signUp(lastName, firstName, email, gender, password);
            setRegistered(true);
            // On vide les champs sensibles après succès
            setPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            console.error("Erreur signup:", err);
            const e = err as { status?: number; message?: string; errors?: FieldError[] };
            if (e.status === 409) {
                setFieldErrors({ email: "Cet email est déjà utilisé." });
            } else if (e.errors) {
                const mapped: Record<string, string> = {};
                e.errors.forEach((fe) => {
                    mapped[fe.field] = mapped[fe.field]
                        ? mapped[fe.field] + '\n' + fe.message
                        : fe.message;
                });
                setFieldErrors(mapped);
            } else if (e.message) {
                setError(e.message);
            } else {
                setError("Une erreur est survenue.");
            }
        }
    }

    if (registered) {
        return (
            <div className="login-page">
                <div className="background-overlay" />
                <div className="main-container">
                    <h1 className="page-title">Vérifiez votre email</h1>
                    <div className="form-card">
                        <div className="success-message">
                            <MailCheck size={32} />
                            <p>Un email de vérification a été envoyé à <strong>{email}</strong>.</p>
                            <p>Cliquez sur le lien dans l&apos;email pour activer votre compte.</p>
                            <Link className="success-link-button" href="/signin">Aller à la connexion</Link>
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
                <h1 className="page-title">S&apos;inscrire</h1>
                <div className="form-card">
                    <form className="login-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>

                        <div className="form-row">
                            <TextInput
                                label="Prénom"
                                value={firstName}
                                onChange={setFirstName}
                                placeholder="Prénom"
                                error={fieldErrors.first_name}
                            />
                            <TextInput
                                label="Nom"
                                value={lastName}
                                onChange={setLastName}
                                placeholder="Nom"
                                error={fieldErrors.last_name}
                            />
                        </div>

                        <SelectField
                            label="Genre"
                            value={gender}
                            onChange={setGender}
                            options={GENDER_OPTIONS}
                            placeholder="Sélectionner"
                            error={fieldErrors.gender}
                        />

                        <TextInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="votre@email.com"
                            error={fieldErrors.email}
                        />

                        <PasswordInput
                            label="Mot de passe"
                            value={password}
                            onChange={setPassword}
                            error={fieldErrors.password}
                        />

                        <PasswordInput
                            label="Confirmation"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />

                        {error && <p className="error-message">{error}</p>}

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
