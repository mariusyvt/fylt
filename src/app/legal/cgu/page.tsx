import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation — Fylt",
};

export default function CguPage() {
    return (
        <>
            <h1 className="legal__title">Conditions Générales d'Utilisation</h1>
            <p className="legal__updated">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

            <div className="legal__placeholder">
                ⚠️ Modèle de CGU à adapter et à faire relire par un professionnel du droit avant
                mise en ligne. Les champs entre crochets [ ] sont à compléter.
            </div>

            <section>
                <h2>1. Objet</h2>
                <p>
                    Les présentes conditions générales d'utilisation (CGU) régissent l'accès et
                    l'utilisation de l'application Fylt. En créant un compte, vous acceptez sans
                    réserve les présentes CGU.
                </p>
            </section>

            <section>
                <h2>2. Accès au service</h2>
                <p>
                    Fylt est accessible gratuitement à toute personne disposant d'un accès
                    Internet. L'inscription requiert une adresse e-mail valide. Vous êtes
                    responsable de la confidentialité de vos identifiants.
                </p>
            </section>

            <section>
                <h2>3. Utilisation du service</h2>
                <p>Vous vous engagez à utiliser Fylt de manière loyale et à ne pas :</p>
                <ul>
                    <li>publier de contenu illicite, offensant ou portant atteinte aux droits de tiers ;</li>
                    <li>tenter de perturber ou de compromettre la sécurité du service ;</li>
                    <li>usurper l'identité d'un tiers ;</li>
                    <li>utiliser le service à des fins commerciales non autorisées.</li>
                </ul>
            </section>

            <section>
                <h2>4. Contenus utilisateurs</h2>
                <p>
                    Vous conservez la propriété des contenus que vous publiez (recettes, photos).
                    Vous garantissez disposer des droits nécessaires sur ces contenus et accordez à
                    Fylt une licence d'utilisation limitée au fonctionnement du service.
                </p>
            </section>

            <section>
                <h2>5. Avertissement santé</h2>
                <p>
                    Fylt fournit des estimations nutritionnelles à titre informatif et ne
                    remplace pas l'avis d'un professionnel de santé. L'éditeur ne saurait être tenu
                    responsable des décisions prises sur la base des informations fournies.
                </p>
            </section>

            <section>
                <h2>6. Responsabilité</h2>
                <p>
                    Le service est fourni « en l'état ». L'éditeur s'efforce d'assurer sa
                    disponibilité mais ne garantit pas l'absence d'interruptions ou d'erreurs. Sa
                    responsabilité ne saurait être engagée en cas de force majeure ou de mauvaise
                    utilisation.
                </p>
            </section>

            <section>
                <h2>7. Suppression de compte</h2>
                <p>
                    Vous pouvez supprimer votre compte à tout moment depuis votre profil. L'éditeur
                    se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des
                    présentes CGU.
                </p>
            </section>

            <section>
                <h2>8. Modification des CGU</h2>
                <p>
                    L'éditeur peut modifier les présentes CGU à tout moment. Les utilisateurs seront
                    informés des modifications substantielles.
                </p>
            </section>

            <section>
                <h2>9. Droit applicable</h2>
                <p>
                    Les présentes CGU sont soumises au droit français. En cas de litige, une
                    solution amiable sera recherchée avant toute action judiciaire.
                </p>
            </section>
        </>
    );
}
