# 🥗 Fylt

Application mobile-first de suivi nutritionnel et de gestion de recettes. Fylt permet de suivre ses apports caloriques au quotidien, créer et partager ses recettes, et atteindre ses objectifs nutritionnels.

## ✨ Fonctionnalités

### 📊 Suivi nutritionnel
- Suivi quotidien des calories, protéines, glucides et lipides
- Organisation des repas par créneau (petit-déjeuner, déjeuner, goûter, dîner)
- Vue hebdomadaire et statistiques mensuelles
- Historique des aliments récemment consommés

### 🍳 Gestion de recettes
- Création de recettes avec photo, ingrédients et étapes
- Calcul automatique des valeurs nutritionnelles
- Catégorisation par type de plat (entrée, plat, dessert…)
- Modification et suppression de recettes

### 🔍 Recherche d'aliments
- Recherche dans une base de données d'aliments (Ciqual)
- Scan de code-barres via OpenFoodFacts
- Ajout d'aliments personnalisés

### 🎯 Objectifs personnalisés
- Onboarding guidé pour définir ses objectifs (5 étapes)
- Calcul du métabolisme de base (formule Mifflin-St Jeor)
- Répartition automatique des macronutriments (30P / 40G / 30L)
- Objectifs ajustables : maintien, sèche modérée/intense, prise de masse modérée/intense

### 👤 Profil utilisateur
- Authentification complète (inscription, connexion, mot de passe oublié, vérification email)
- Photo de profil
- Suivi du poids

## 🛠️ Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 16** | Framework React (App Router) |
| **React 19** | UI |
| **TypeScript** | Typage statique |
| **Sass** | Styles |
| **Vitest** | Tests unitaires |
| **React Testing Library** | Tests de hooks |
| **OpenFoodFacts SDK** | Données nutritionnelles par code-barres |
| **Lucide React** | Icônes |

## 📁 Structure du projet

```
src/
├── api/              # Configuration API et services (recipes, foods, profile, tracking…)
├── app/              # Pages Next.js (App Router)
│   ├── (auth)/       # Pages d'authentification (signin, signup, forgot-password…)
│   └── (pages)/      # Pages principales (tracking, recipes, add, profile)
├── components/       # Composants React (ui, add, recipes, tracking, profile…)
├── context/          # Contexte d'authentification
├── hooks/            # Hooks personnalisés (useAddRecipe, useTracking, useNutrition…)
├── styles/           # Fichiers SCSS
├── types/            # Types TypeScript
└── utils/            # Fonctions utilitaires (nutrition, TDEE, formatage)
```

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/mariusyvt/fylt.git
cd fylt
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Lancer les tests

```bash
npm test
```

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Serveur de production |
| `npm test` | Lancer les tests |
| `npm run test:watch` | Tests en mode watch |
| `npm run lint` | Linter ESLint |
