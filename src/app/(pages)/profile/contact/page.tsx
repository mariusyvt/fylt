"use client"

import { useState } from "react";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import Link from "next/link";
import TextArea from "@/components/ui/TextArea";
import { useAuth } from "@/hooks/useAuth";
import { sendContactMessage } from "@/api/services/contact.service";

const SUBJECT_OPTIONS = [
    { value: "", label: "Choisir un sujet…" },
    { value: "bug", label: "Bug / Problème technique" },
    { value: "question", label: "Question" },
    { value: "suggestion", label: "Suggestion / Amélioration" },
];

export default function ContactPage() {
    const { isAuthenticated } = useAuth();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (!subject) {
            setError("Veuillez choisir un sujet.");
            return;
        }
        if (!message.trim()) {
            setError("Le message est requis.");
            return;
        }

        if (!isAuthenticated) {
            setError("Vous devez être connecté.");
            return;
        }

        setSending(true);
        const subjectLabel = SUBJECT_OPTIONS.find(o => o.value === subject)?.label ?? subject;
        try {
            await sendContactMessage({ subject: subjectLabel, message });
            setSuccess(true);
            setSubject("");
            setMessage("");
        } catch {
            setError("Une erreur est survenue. Réessayez plus tard.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="informations-page">
            <div className="bg-gradient-decor"></div>

            <header className="informations-header">
                <Link className="circle-btn" href="/profile">
                    <ArrowLeft />
                </Link>
                <h1 className="informations-title">Nous contacter</h1>
            </header>

            <main className="informations-content">
                <div className="contact-intro">
                    <h2 className="contact-intro__title">Contactez notre équipe</h2>
                    <p className="contact-intro__text">
                        Une question, un bug ou une suggestion ? Nous sommes là pour vous aider et répondons sous 48h.
                    </p>
                </div>

                {success ? (
                    <div className="info-card contact-success">
                        <div className="contact-success__icon">✉️</div>
                        <p className="contact-success__title">Message envoyé !</p>
                        <p className="contact-success__text">
                            Nous vous répondrons dans les plus brefs délais.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => setSuccess(false)}
                        >
                            Envoyer un autre message
                        </button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div>
                            <label className="field-label">Sujet</label>
                            <div className="select-wrapper">
                                <select
                                    className="text-input select-native"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                >
                                    {SUBJECT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value} disabled={!opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="select-icon"><ChevronDown size={18} /></span>
                            </div>
                        </div>

                        <TextArea
                            label="Message"
                            value={message}
                            onChange={setMessage}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button className="btn-primary" type="submit" disabled={sending}>
                        {sending ? "Envoi..." : (
                            <><Send size={16} /> Envoyer</>
                        )}
                    </button>
                    </form>
                )}
            </main>
        </div>
    );
}

