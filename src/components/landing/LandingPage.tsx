"use client";

import Link from "next/link";
import { Smartphone, Utensils, BarChart3, BookOpen, Scan } from "lucide-react";

const FEATURES = [
    {
        icon: BookOpen,
        title: "Vos recettes",
        description: "Créez et organisez vos recettes avec les macros calculées automatiquement.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    },
    {
        icon: BarChart3,
        title: "Suivi nutritionnel",
        description: "Suivez vos calories et macros au quotidien pour atteindre vos objectifs.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
        icon: Scan,
        title: "Scanner rapide",
        description: "Scannez un code-barres pour ajouter un aliment en quelques secondes.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
        icon: Utensils,
        title: "Planification",
        description: "Planifiez vos repas et gardez le contrôle sur votre alimentation.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    },
];

export default function LandingPage() {
    return (
        <div className="landing">
            <header className="landing__header">
                <div className="landing__logo">

                    <img
                        src={"/icons/fylt-logo-1024.webp"}
                        alt={"Fylt Logo"}
                        width={40}
                        height={40}
                    />
                    <span>Fylt</span>
                </div>
            </header>

            <main className="landing__main">
                <section className="landing__hero">
                    <div className="landing__hero-content">
                        <h1 className="landing__title">
                            Mangez mieux,<br />
                            <span className="landing__title--accent">atteignez vos objectifs.</span>
                        </h1>
                        <p className="landing__subtitle">
                            Fylt est votre assistant nutrition personnel. Créez vos recettes, suivez vos calories et atteignez vos objectifs — tout depuis votre téléphone.
                        </p>
                        <div className="landing__cta">
                            <div className="landing__phone-badge">
                                <Smartphone size={20} />
                                <span>Ouvrez cette page sur votre téléphone pour commencer</span>
                            </div>
                        </div>
                    </div>
                    <div className="landing__hero-visual">
                        <div className="landing__phone-mockup">
                            <div className="landing__phone-frame">
                                <img
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=600&fit=crop"
                                    alt="Aperçu Fylt"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing__food-banner">
                    <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=400&fit=crop" alt="Healthy food" />
                </section>

                <section className="landing__features">
                    <h2 className="landing__features-title">Tout ce dont vous avez besoin</h2>
                    <div className="landing__features-grid">
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="landing__feature-card">
                                <div className="landing__feature-img">
                                    <img src={feature.image} alt={feature.title} />
                                </div>
                                <div className="landing__feature-body">
                                    <div className="landing__feature-icon">
                                        <feature.icon size={20} />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="landing__footer">
                <p>© {new Date().getFullYear()} Fylt — Application mobile uniquement</p>
                <nav className="landing__footer-links">
                    <Link href="/legal/mentions-legales">Mentions légales</Link>
                    <Link href="/legal/confidentialite">Confidentialité</Link>
                    <Link href="/legal/cgu">CGU</Link>
                    <Link href="/legal/cookies">Cookies</Link>
                </nav>
            </footer>
        </div>
    );
}
