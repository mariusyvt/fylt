# Fylt

Fylt est une application web mobile-first de suivi nutritionnel et de gestion de recettes. L'idée : suivre ses apports au quotidien sans friction, garder ses recettes au même endroit, et avancer vers ses objectifs sans se noyer dans les chiffres.

C'est un projet personnel, pensé et développé de bout en bout — de la conception produit jusqu'au design et à l'implémentation.

## L'idée

La plupart des applis de nutrition sont soit trop complexes, soit truffées de publicités. Je voulais quelque chose de simple et agréable à utiliser tous les jours : on ouvre l'app, on ajoute son repas, on voit où on en est. C'est tout.

Fylt est une PWA (Progressive Web App), donc installable directement depuis le navigateur sur iOS comme sur Android, sans passer par un store.

## Ce que fait l'application

**Suivi nutritionnel**
Suivi quotidien des calories et des macros (protéines, glucides, lipides), repas organisés par créneau (petit-déjeuner, déjeuner, goûter, dîner), vue hebdomadaire et statistiques mensuelles, et un historique des aliments récemment consommés pour aller plus vite.

**Recettes**
Création de recettes avec photo, ingrédients et étapes, calcul automatique des valeurs nutritionnelles, et catégorisation par type de plat.

**Recherche d'aliments**
Recherche dans la base de données Ciqual, scan de code-barres via OpenFoodFacts, et possibilité d'ajouter ses propres aliments.

**Objectifs personnalisés**
Un onboarding guidé calcule le métabolisme de base (formule Mifflin-St Jeor) et répartit automatiquement les macros selon l'objectif choisi : maintien, sèche ou prise de masse.

**Compte utilisateur**
Authentification complète (inscription, connexion, mot de passe oublié, vérification email), photo de profil et suivi du poids.

## Stack technique

| Technologie | Usage |
|---|---|
| Next.js 16 (App Router) | Framework React |
| React 19 | UI |
| TypeScript | Typage statique |
| Sass | Styles |
| PWA | Installation mobile, mode standalone |
| OpenFoodFacts SDK | Données nutritionnelles par code-barres |
| Vitest + Testing Library | Tests |

## Aperçu de l'architecture

Le code est organisé par domaine plutôt que par type de fichier, pour garder chaque fonctionnalité cohérente et facile à faire évoluer :

```
src/
├── api/          # Services et configuration API (recipes, foods, profile, tracking…)
├── app/          # Pages Next.js (App Router) — authentification et pages principales
├── components/   # Composants React par domaine (ui, add, recipes, tracking, profile…)
├── context/      # Contexte d'authentification
├── hooks/        # Hooks métier (useTracking, useNutrition, useAddRecipe…)
├── styles/       # Feuilles SCSS
├── types/        # Types TypeScript
└── utils/        # Logique nutrition (TDEE, macros, formatage)
```

---

Développé par [Marius YVART](https://github.com/mariusyvt).
