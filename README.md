# Plateforme de Réservation de Transport - Mawlid 2026

## 📋 Description

Une plateforme complète de réservation de transport développée avec **Node.js**, **Express**, et **PostgreSQL** pour faciliter les réservations de trajets pour le Mawlid 2026.

## 🎯 Fonctionnalités Principales

### Utilisateurs
- ✅ Inscription et connexion sécurisée (JWT)
- ✅ Gestion de profil (mise à jour des informations)
- ✅ Historique des réservations
- ✅ Changement de mot de passe

### Trajets
- ✅ Affichage de tous les trajets disponibles
- ✅ Recherche de trajets (ville de départ, arrivée, date)
- ✅ Création de trajets (chauffeurs)
- ✅ Mise à jour et annulation de trajets
- ✅ Gestion des places disponibles

### Réservations
- ✅ Création de réservations
- ✅ Modification de réservations
- ✅ Annulation de réservations avec remboursement des places
- ✅ Suivi des réservations
- ✅ Numéro de référence unique pour chaque réservation

### Paiements
- ✅ Traitement des paiements
- ✅ Historique des transactions
- ✅ Support multiple méthodes de paiement (Stripe, PayPal, Virement bancaire)
- ✅ Webhooks pour confirmations de paiement

### Administration
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des utilisateurs (activation/désactivation)
- ✅ Suivi de tous les trajets et réservations
- ✅ Rapport des paiements

## 🛠️ Technologies Utilisées

- **Backend:** Node.js, Express.js
- **Base de données:** PostgreSQL
- **ORM:** Sequelize
- **Authentification:** JWT (jsonwebtoken)
- **Sécurité:** Bcrypt, Helmet, CORS
- **Validation:** Express-validator
- **Paiements:** Stripe API

## 📦 Installation

### Prérequis
- Node.js >= 14.0.0
- PostgreSQL >= 12
- npm >= 6.0.0

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Dioufybabacar90/mawlid-transport-booking.git
   cd mawlid-transport-booking
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Créer la base de données PostgreSQL**
   ```bash
   createdb mawlid_booking
   ```

5. **Lancer le serveur**
   ```bash
   npm run dev  # Mode développement (avec nodemon)
   npm start    # Mode production
   ```

   Le serveur sera accessible à: `http://localhost:5000`

## 🔌 Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/profile` - Récupérer le profil
- `PUT /api/users/profile` - Mettre à jour le profil
- `GET /api/users/bookings` - Mes réservations
- `POST /api/users/change-password` - Changer le mot de passe

### Trajets
- `GET /api/trips` - Tous les trajets
- `GET /api/trips/search` - Rechercher des trajets
- `GET /api/trips/:id` - Détails d'un trajet
- `POST /api/trips` - Créer un trajet (chauffeur)
- `PUT /api/trips/:id` - Mettre à jour un trajet
- `DELETE /api/trips/:id` - Annuler un trajet

### Réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings/:id` - Détails de la réservation
- `PUT /api/bookings/:id` - Mettre à jour une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation

### Paiements
- `POST /api/payments/process` - Traiter un paiement
- `GET /api/payments/:id` - Détails du paiement
- `POST /api/payments/webhook` - Webhook Stripe/PayPal

### Administration
- `GET /api/admin/dashboard/stats` - Statistiques
- `GET /api/admin/users` - Tous les utilisateurs
- `GET /api/admin/trips` - Tous les trajets
- `GET /api/admin/bookings` - Toutes les réservations
- `GET /api/admin/payments` - Tous les paiements
- `POST /api/admin/users/:id/toggle-status` - Activer/Désactiver utilisateur

## 🔐 Authentification

La plateforme utilise JWT pour l'authentification. Les tokens sont envoyés dans l'en-tête `Authorization`:

```bash
Authorization: Bearer <your_jwt_token>
```

## 📝 Exemple d'utilisation

### 1. S'inscrire
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+221123456789",
    "password": "secure_password",
    "role": "user"
  }'
```

### 2. Créer un trajet (chauffeur)
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "departureCity": "Dakar",
    "arrivalCity": "Touba",
    "departureTime": "2026-01-14T08:00:00Z",
    "arrivalTime": "2026-01-14T12:00:00Z",
    "vehicleType": "bus",
    "totalSeats": 50,
    "pricePerSeat": 5000
  }'
```

### 3. Réserver une place
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tripId": "<trip_id>",
    "seatsBooked": 2,
    "specialRequests": "Chaise roulante requise"
  }'
```

## 🧪 Tests

```bash
npm test
```

## 📚 Structure du Projet

```
mawlid-transport-booking/
├── config/
│   └── database.js           # Configuration PostgreSQL
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── trip.controller.js
│   ├── booking.controller.js
│   ├── payment.controller.js
│   └── admin.controller.js
├── models/
│   ├── User.js
│   ├── Trip.js
│   ├── Booking.js
│   └── Payment.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── trip.routes.js
│   ├── booking.routes.js
│   ├── payment.routes.js
│   └── admin.routes.js
├── middleware/
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── .env.example              # Exemple de variables d'environnement
├── .gitignore
├── package.json
├── server.js                 # Point d'entrée
└── README.md
```

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 💬 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

## 🎉 Prochaines Étapes

- [ ] Ajouter un frontend React
- [ ] Implémentation complète des paiements Stripe/PayPal
- [ ] Système d'email pour confirmations
- [ ] Notification en temps réel (WebSocket)
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API Swagger
- [ ] Déploiement sur Heroku/AWS

---

**Développé avec ❤️ pour le Mawlid 2026**
