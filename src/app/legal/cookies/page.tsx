import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de cookies — Fylt",
};

export default function CookiesPage() {
    return (
        <>
            <h1 className="legal__title">Politique de cookies</h1>
            <p className="legal__updated">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

            <section>
                <h2>1. Qu'est-ce qu'un cookie ?</h2>
                <p>
                    Un cookie est un petit fichier déposé sur votre appareil lors de la visite d'un
                    site. Il permet de conserver certaines informations pour faciliter votre
                    navigation et sécuriser votre session.
                </p>
            </section>

            <section>
                <h2>2. Cookies utilisés par Fylt</h2>
                <h3>Cookies strictement nécessaires</h3>
                <p>
                    Ces cookies sont indispensables au fonctionnement du service et ne nécessitent
                    pas votre consentement :
                </p>
                <ul>
                    <li>
                        <strong>Cookie de session (httpOnly) :</strong> maintient votre connexion et
                        sécurise votre authentification.
                    </li>
                </ul>
            </section>

            <section>
                <h2>3. Gestion des cookies</h2>
                <p>
                    Vous pouvez à tout moment configurer votre navigateur pour refuser ou supprimer
                    les cookies. Le blocage des cookies strictement nécessaires peut toutefois
                    empêcher le bon fonctionnement du service (notamment la connexion).
                </p>
            </section>

            <section>
                <h2>4. Contact</h2>
                <p>
                    Pour toute question relative aux cookies, contactez-nous à{" "}
                    <a href="mailto:contact@fylt.app">contact@fylt.app</a>.
                </p>
            </section>
        </>
    );
}
