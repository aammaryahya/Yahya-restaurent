#  Restaurent Management System

Application complète de gestion de restaurant développée avec **React + Vite**, **Node.js + Express**, **MongoDB**, et **Socket.IO**.

##  Fonctionnalités

###  Authentification & Rôles
- Admin
- Serveur (Waiter)
- Chef
- Caissier (Cashier)

###  Admin
- Gestion des employés
- Gestion des tables
- Gestion du menu
- Gestion des commandes
- Gestion de l’inventaire
- Historique des transactions d’inventaire

###  Chef
- Voir les commandes en cours
- Mettre à jour le statut des plats
- Consulter l’inventaire

### Serveur
- Voir les tables
- Créer des commandes
- Voir les commandes par table
- Consulter l’inventaire

###  Caissier
- Voir les commandes
- Voir les détails d’une commande
- Finaliser les paiements

###  Temps réel
- Mise à jour instantanée des commandes
- Statuts synchronisés entre les rôles
- Socket.IO global

---

##  Stack Technique

### Frontend
- React + Vite
- React Router
- Context API (Auth)
- TailwindCSS
- Déployé sur **Vercel**

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- Déployé sur **Render**
