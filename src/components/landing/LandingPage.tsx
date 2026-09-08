"use client";

import Link from "next/link";
import { Smartphone, Utensils, BarChart3, BookOpen, Scan } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Vos recettes",
    description:
      "Créez et organisez vos recettes avec les macros calculées automatiquement.",
    image: "./images/landing/pates_bolognaises.webp",
  },
  {
    icon: BarChart3,
    title: "Suivi nutritionnel",
    description:
      "Suivez vos calories et macros au quotidien pour atteindre vos objectifs.",
    image: "./images/landing/salade.webp",
  },
  {
    icon: Scan,
    title: "Scanner rapide",
    description:
      "Scannez un code-barres pour ajouter un aliment en quelques secondes.",
    image: "./images/landing/salade_pates.webp",
  },
  {
    icon: Utensils,
    title: "Planification",
    description:
      "Planifiez vos repas et gardez le contrôle sur votre alimentation.",
    image: "./images/landing/riz.webp",
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
              Mangez mieux,
              <br />
              <span className="landing__title--accent">
                atteignez vos objectifs.
              </span>
            </h1>
            <p className="landing__subtitle">
              Fylt est votre assistant nutrition personnel. Créez vos recettes,
              suivez vos calories et atteignez vos objectifs — tout depuis votre
              téléphone.
            </p>
            <div className="landing__cta">
              <div className="landing__phone-badge">
                <Smartphone size={20} />
                <span>
                  Ouvrez cette page sur votre téléphone pour commencer
                </span>
              </div>
            </div>
          </div>
          <div className="landing__hero-visual">
            <div className="landing__phone-mockup">
              <div className="landing__phone-frame">
                <img
                  src="./images/landing/salade_saumon.webp"
                  alt="Aperçu Fylt"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="landing__food-banner">
          <img src="./images/landing/pizza.webp" alt="Healthy food" />
        </section>

        <section className="landing__features">
          <h2 className="landing__features-title">
            Tout ce dont vous avez besoin
          </h2>
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
