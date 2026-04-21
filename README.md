# CarRent CI

Site de location et vente de véhicules en Côte d'Ivoire.

## Structure du projet

```
carentci/
├── frontend/     → Site public (index.html, pages services)
├── admin/        → Dashboard admin
├── backend/      → API Node.js + Express + MySQL
└── docs/         → Documentation
```

## Installation locale

### Prérequis
- Node.js 18+
- MySQL 8+
- Git

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec tes credentials MySQL
npm start
```

Le backend démarre sur `http://localhost:5000`

### Frontend

Ouvrir `frontend/index.html` avec Live Server ou servir via le backend :
```
http://localhost:5000/frontend/index.html
```

### Admin

```
http://localhost:5000/admin/admin.html
```

Credentials par défaut : `carrentci` / `admin123`

## Base de données

Importer le schéma depuis `backend/migrations/`

## Déploiement

Voir `docs/DEPLOYMENT.md`

## Licence

MIT
