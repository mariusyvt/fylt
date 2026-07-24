"use client"

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import { useAuth } from "@/hooks/useAuth";
import { sendContactMessage } from "@/api/services/contact.service";

export default function ContactPage() {
    const { token } = useAuth();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (!subject.trim()) {
            setError("Le sujet est requis.");
            return;
        }
        if (!message.trim()) {
            setError("Le message est requis.");
            return;
        }

        setSending(true);
        try {
            await sendContactMessage(token!, { subject, message });

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
                {success ? (
                    <div className="info-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
                        <p className="save-success" style={{ margin: 0 }}>
                            Votre message a bien été envoyé. Nous vous répondrons rapidement !
                        </p>
                        <button
                            className="btn-primary"
                            style={{ marginTop: "1rem" }}
                            onClick={() => setSuccess(false)}
                        >
                            Envoyer un autre message
                        </button>
                    </div>
                ) : (
                    <div className="info-card" style={{ padding: "1rem 1.25rem" }}>
                        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <TextInput
                                label="Sujet"
                                value={subject}
                                onChange={setSubject}
                                placeholder="Ex: Suggestion, Bug, Question..."
                            />

                            <TextArea
                                label="Message"
                                value={message}
                                onChange={setMessage}
                                placeholder="Décrivez votre demande..."
                                rows={5}
                            />

                            {error && <p className="error-message">{error}</p>}

                            <button className="btn-primary" type="submit" disabled={sending}>
                                {sending ? "Envoi..." : (
                                    <><Send size={16} /> Envoyer</>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

