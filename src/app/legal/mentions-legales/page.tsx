import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales — Fylt",
};

export default function MentionsLegalesPage() {
    return (
        <>
            <h1 className="legal__title">Mentions légales</h1>
            <p className="legal__updated">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

            <div className="legal__placeholder">
                ⚠️ Ce site est édité par un particulier à titre non professionnel. Conformément à
                l'article 6 III 2 de la loi n°2004-575 (LCEN), l'éditeur peut conserver l'anonymat
                vis-à-vis du public à condition d'avoir communiqué son identité à l'hébergeur. Seuls
                un moyen de contact et les informations de l'hébergeur sont donc affichés
                ci-dessous. Complétez les champs entre crochets [ ].
            </div>

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
                    <li><strong>Contact :</strong> <a href="mailto:[contact@votredomaine.com]">[contact@votredomaine.com]</a></li>
                </ul>
            </section>

            <section>
                <h2>2. Hébergement</h2>
                <p>Le site est hébergé par :</p>
                <ul>
                    <li><strong>Hébergeur :</strong> [Nom de l'hébergeur, ex. Vercel Inc.]</li>
                    <li><strong>Adresse :</strong> [Adresse postale de l'hébergeur]</li>
                    <li><strong>Contact :</strong> [Site / e-mail de l'hébergeur]</li>
                </ul>
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
                    <a href="mailto:[contact@votredomaine.com]">[contact@votredomaine.com]</a>.
                </p>
            </section>
        </>
    );
}
