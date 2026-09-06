import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de confidentialité — Fylt",
};

export default function ConfidentialitePage() {
    return (
        <>
            <h1 className="legal__title">Politique de confidentialité</h1>
            <p className="legal__updated">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

            <div className="legal__placeholder">
                ⚠️ Document conforme au RGPD (UE 2016/679). Adaptez les champs entre crochets [ ] et
                faites-le relire par un professionnel. Vérifiez que les traitements décrits
                correspondent réellement à votre application.
            </div>

            <section>
                <h2>1. Responsable du traitement</h2>
                <p>
                    Le responsable du traitement est l'éditeur du site, particulier agissant à titre
                    non professionnel (voir les mentions légales). Pour toute question relative à vos
                    données ou pour exercer vos droits, un point de contact dédié est mis à votre
                    disposition : <a href="mailto:[contact@votredomaine.com]">[contact@votredomaine.com]</a>.
                </p>
            </section>

            <section>
                <h2>2. Données collectées</h2>
                <p>Dans le cadre de l'utilisation de Fylt, nous collectons :</p>
                <ul>
                    <li><strong>Données de compte :</strong> adresse e-mail, prénom, nom, mot de passe (chiffré).</li>
                    <li><strong>Données de profil :</strong> âge, sexe, poids, taille, niveau d'activité, objectifs.</li>
                    <li><strong>Données d'utilisation :</strong> recettes créées, aliments consommés, suivi du poids.</li>
                    <li><strong>Données techniques :</strong> nécessaires au fonctionnement (session, sécurité).</li>
                </ul>
            </section>

            <section>
                <h2>3. Finalités et bases légales</h2>
                <ul>
                    <li><strong>Fournir le service</strong> (gestion du compte, suivi nutritionnel) — exécution du contrat.</li>
                    <li><strong>Calculer vos besoins caloriques</strong> — exécution du contrat.</li>
                    <li><strong>Assurer la sécurité</strong> du service — intérêt légitime.</li>
                    <li><strong>Respecter nos obligations légales</strong> — obligation légale.</li>
                </ul>
            </section>

            <section>
                <h2>4. Durée de conservation</h2>
                <p>
                    Vos données sont conservées tant que votre compte est actif. En cas de
                    suppression du compte, elles sont effacées ou anonymisées dans un délai de
                    [30 jours], sauf obligation légale de conservation.
                </p>
            </section>

            <section>
                <h2>5. Partage des données</h2>
                <p>
                    Vos données ne sont ni vendues ni louées. Elles peuvent être traitées par nos
                    sous-traitants techniques (hébergeur, base de données) dans le strict cadre du
                    service. Certaines fonctionnalités s'appuient sur des services tiers
                    (ex. OpenFoodFacts pour les données produits).
                </p>
            </section>

            <section>
                <h2>6. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul>
                    <li>Droit d'accès, de rectification et d'effacement</li>
                    <li>Droit à la limitation et à l'opposition au traitement</li>
                    <li>Droit à la portabilité de vos données</li>
                    <li>Droit de retirer votre consentement à tout moment</li>
                </ul>
                <p>
                    Pour exercer ces droits, contactez-nous à{" "}
                    <a href="mailto:[contact@votredomaine.com]">[contact@votredomaine.com]</a>. Vous
                    pouvez également introduire une réclamation auprès de la CNIL (
                    <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
                </p>
            </section>

            <section>
                <h2>7. Sécurité</h2>
                <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                    pour protéger vos données (mots de passe chiffrés, sessions sécurisées par
                    cookies httpOnly, connexions chiffrées HTTPS).
                </p>
            </section>
        </>
    );
}
