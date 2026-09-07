import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales — Fylt",
};

export default function MentionsLegalesPage() {
    return (
        <>
            <h1 className="legal__title">Mentions légales</h1>
            <p className="legal__updated">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

            <section>
                <h2>1. Éditeur du site</h2>
                <p>
                    Le site et l'application Fylt sont édités par un particulier, à titre
                    personnel et non professionnel, dans le cadre d'un projet non commercial.
                </p>
                <p>
                    Conformément à l'article 6 III 2 de la LCEN, l'éditeur, personne physique non
                    professionnelle, a choisi de préserver son anonymat auprès du public. Son
                    identité et ses coordonnées ont été communiquées à l'hébergeur du site (voir
                    section 2), qui peut les tenir à la disposition des autorités compétentes.
                </p>
                <ul>
                    <li><strong>Contact :</strong> <a href="mailto:contact@fylt.app">contact@fylt.app</a></li>
                </ul>
            </section>

            <section>
                <h2>2. Hébergement</h2>
                <p><strong>Hébergement :</strong> site auto-hébergé.</p>
            </section>

            <section>
                <h2>3. Propriété intellectuelle</h2>
                <p>
                    L'ensemble des contenus présents sur Fylt (textes, graphismes, logo,
                    interface, code) est protégé par le droit de la propriété intellectuelle et
                    demeure la propriété exclusive de l'éditeur, sauf mention contraire. Toute
                    reproduction ou utilisation non autorisée est interdite.
                </p>
                <p>
                    Les contenus créés par les utilisateurs (recettes, photos) restent la propriété
                    de leurs auteurs.
                </p>
            </section>

            <section>
                <h2>4. Responsabilité</h2>
                <p>
                    Fylt est un outil d'aide au suivi nutritionnel. Les informations
                    nutritionnelles fournies (notamment via des bases de données tierces) sont
                    données à titre indicatif et ne constituent pas un avis médical. Consultez un
                    professionnel de santé avant toute modification importante de votre alimentation.
                </p>
            </section>

            <section>
                <h2>5. Contact</h2>
                <p>
                    Pour toute question, vous pouvez nous écrire à l'adresse :{" "}
                    <a href="mailto:contact@fylt.app">contact@fylt.app</a>.
                </p>
            </section>
        </>
    );
}
