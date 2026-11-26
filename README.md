# Monobloc

Application web pour gérer sa collection de livres personnelle : chaque utilisateur s'inscrit, se connecte, puis ajoute, modifie et supprime ses propres livres.

Projet réalisé avec **Express 5**, **Twig**, **Prisma** et **MySQL**.

## Fonctionnalités

- Inscription avec vérification des champs (email valide, mot de passe de 8 caractères minimum, confirmation)
- Mot de passe chiffré avec bcrypt (extension Prisma)
- Connexion et déconnexion par session
- Pages protégées : sans connexion, on est renvoyé vers `/login`
- Collection de livres : ajout, modification, suppression (chacun ne voit et ne modifie que ses livres)
- Page 404

## Installation

Prérequis : Node.js 18 ou plus et un serveur MySQL (par exemple avec WAMP, XAMPP ou Laragon).

1. Installer les dépendances (le client Prisma est généré automatiquement) :

   ```bash
   npm install
   ```

2. Copier `.env.example` en `.env`, puis adapter `DATABASE_URL` à ton MySQL :

   ```
   DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/monobloc"
   ```

3. Créer la base et les tables :

   ```bash
   npx prisma migrate deploy
   ```

4. Lancer le serveur :

   ```bash
   npm run dev
   ```

   L'application est sur http://localhost:3000. `npm run dev` redémarre le serveur à chaque modification (nodemon) ; `npm start` le lance sans surveillance.

## Variables d'environnement

| Variable         | Rôle                                   | Par défaut          |
| ---------------- | -------------------------------------- | ------------------- |
| `DATABASE_URL`   | Connexion MySQL (obligatoire)          | —                   |
| `PORT`           | Port du serveur                        | `3000`              |
| `SESSION_SECRET` | Clé de signature des cookies de session | valeur locale de test |

En production, définir un `SESSION_SECRET` long et aléatoire.

## Routes

| Méthode | Route             | Rôle                          | Connexion requise |
| ------- | ----------------- | ----------------------------- | ----------------- |
| GET     | `/`               | Ma collection                 | oui               |
| GET/POST| `/register`       | Inscription                   | non               |
| GET/POST| `/login`          | Connexion                     | non               |
| POST    | `/logout`         | Déconnexion                   | —                 |
| GET/POST| `/addBook`        | Ajouter un livre              | oui               |
| GET/POST| `/updateBook/:id` | Modifier un livre             | oui               |
| POST    | `/deleteBook/:id` | Supprimer un livre            | oui               |

## Structure

```
app.js                  point d'entrée (Express, sessions, routes, 404)
prisma/                 schéma (models/) et migrations
public/assets/          CSS et images
src/Routes/             définition des routes
src/controllers/        logique de chaque page
src/services/extensions authguard (protection des pages) et chiffrement du mot de passe
src/views/              templates Twig (layout, partials, pages)
```

## Auteur

Suzon Robin
