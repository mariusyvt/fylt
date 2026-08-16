"use client"

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="informations-page">
            <div className="bg-gradient-decor"></div>

            <header className="informations-header">
                <Link className="circle-btn" href="/profile">
                    <ArrowLeft />
                </Link>
                <h1 className="informations-title">À propos</h1>
            </header>

            <main className="informations-content">
                <div className="info-card" style={{ padding: "1.5rem" }}>
                    <h2 className="about-heading">FitMeal</h2>
                    <p className="about-text">
                        Je suis un <strong>étudiant en développement web</strong>, passionné de nutrition et de sport. Au fil de mes entraînements, je me suis rendu compte qu&apos;il était difficile de garder une vue claire sur ce que je mangeais réellement et sur l&apos;équilibre de mes repas.
                    </p>

                    <p className="about-subheading">Le déclic</p>
                    <p className="about-text">
                        Les applications existantes étaient souvent <strong>trop complexes</strong> ou <strong>trop limitées</strong> à mon goût. Et surtout, <strong>les meilleures sont presque toujours payantes</strong> : les fonctionnalités vraiment utiles se cachent derrière un abonnement. J&apos;ai voulu une alternative <strong>simple et gratuite</strong>, taillée pour mes besoins.
                    </p>

                    <p className="about-subheading">Le projet</p>
                    <p className="about-text">
                        FitMeal me permet de <strong>créer mes propres recettes</strong>, de <strong>calculer automatiquement leurs valeurs nutritionnelles</strong> et de <strong>suivre au quotidien</strong> mes calories et mes macronutriments. C&apos;est un outil qui réunit mes deux centres d&apos;intérêt — le code et la nutrition — et que j&apos;utilise au jour le jour.
                    </p>

                    <p className="about-subheading">L&apos;apprentissage</p>
                    <p className="about-text">
                        Ce projet me fait aussi <strong>progresser techniquement</strong> : conception d&apos;une interface mobile, gestion d&apos;une base de données d&apos;aliments, intégration d&apos;une API et développement d&apos;une <strong>application installable (PWA)</strong>. Chaque fonctionnalité est une occasion d&apos;apprendre.
                    </p>

                    <hr className="about-divider" />

                    <p className="about-text">
                        Mon objectif est de rendre le <strong>suivi alimentaire simple, rapide et accessible à tous</strong>, sans se perdre dans des calculs interminables. FitMeal continue d&apos;évoluer, et de nouvelles fonctionnalités sont ajoutées régulièrement.
                    </p>
                    <p className="about-version">Version 1.0.0</p>
                </div>
            </main>
        </div>
    );
}
