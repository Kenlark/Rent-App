[FR]

# Projet : Site de Location de Véhicules

## 📝 Description

Ce projet est un site interactif de location de véhicules. Il permet aux utilisateurs de parcourir les véhicules disponibles, filtrer les résultats, et réserver un véhicule via un formulaire qui sera envoyé au loueur. Les administrateurs peuvent ajouter des locations au site, les supprimer et les modifier en temps réel.

![Screenshot de l'application](../Client/public/screen%20app.png)

---

## ⚙️ Fonctionnalités

- Affichage des véhicules disponibles et indisponibles (prix, transmission, places, carburant, etc.).
- Réservation de véhicules pour les utilisateurs enregistrés.
- Gestion des voitures et des réservations par un administrateur via une boîte mail où il recevra les demandes de location.
- Authentification et gestion des rôles (utilisateur/admin).

---

## 🔧 Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure).
- [npm](https://www.npmjs.com/).
- [MongoDB](https://www.mongodb.com/) (v4.4 ou supérieure).
- Compte [Cloudinary](https://cloudinary.com/).
- Compte [Resend](https://resend.com/).

---

## 🚀 Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Kenlark/Rent-App.git
   ```

# Front-end

cd Rent-App/Client
npm install

# Back-end

cd ../Server
npm install

`````

2. **Configuration env**
   Je suggère de regrouper toutes les variables d'environnement dans un bloc de code unique :

````markdown
## ⚙️ Configuration

Créez un fichier `.env` dans le dossier `Server` :

```env
# Serveur
PORT=5000

# Base de données
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<db_name>

# JWT
JWT_SECRET=votre_secret_key
JWT_LIFETIME=7d

# Cloudinary
CLOUD_NAME=votre_cloud_name
CLOUD_API_KEY=votre_api_key
CLOUD_API_SECRET=votre_api_secret

# Resend
API_KEY_RESEND=votre_api_key_resend
`````

````

# URL du back-end

Le back-end se lancera par défaut sur l'adresse = http://localhost:5173 , vous pourrez le changer dans `app.js` pour y mettre l'addresse de votre domaine ou de votre serveur local

## 🖥️ Démarrage

### Lancer le projet en mode développement

Pour travailler sur le projet localement, utilisez les commandes suivantes :

- **Back-end** :

```bash
cd Rent-App/Server
npm run dev
```

````

- **Front-end** :

```bash
cd Rent-App/Client
npm run dev
```

### Lancer le projet en mode production

Pour travailler sur le projet en production, utilisez les commandes suivantes :

```bash
cd Rent-App/Client
npm run build
```

Pour une prévisualisation du front-end :

```bash
npm run preview
```

Pour le back-end :

```bash
npm run start
```

### **Et si vous voulez une commande `start` ?**

Si vous préférez utiliser une commande `start` pour lancer l'application en production, vous pouvez ajouter ceci à votre `package.json` :

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "start": "vite preview"
}
```

### Structure du projet

Rent-App/
├── Client/ # Front-end React
│ ├── src/ # Code source de l'application
│ ├── public/ # Fichiers statiques
│ └── package.json
├── Server/ # Back-end Node.js/Express
│ ├── src/ # API et logique serveur
│ ├── .env # Variables d'environnement
│ └── package.json
├── README.md # Documentation du projet

### 🤝 Contributions

Les contributions sont les bienvenues ! Veuillez soumettre vos suggestions via des issues ou des pull requests.

### 🎨 Crédits

- [React](https://reactjs.org/) : Bibliothèque JavaScript pour la création d'interfaces utilisateur.
- [React Router](https://reactrouter.com/) : Gestionnaire de routes pour les applications React.
- [Vite](https://vitejs.dev/) : Outil de développement rapide pour le front-end.
- [Express](https://expressjs.com/) : Framework pour le back-end Node.js.
- [MongoDB](https://www.mongodb.com/) : Base de données NoSQL utilisée pour stocker les données.
- [Iconmonstr](https://iconmonstr.com/) : Icônes utilisées dans l'interface utilisateur.
- [Flaticon](https://www.flaticon.com/) : Icônes utilisées dans l'interface utilisateur.
- [FontAwesome](https://fontawesome.com/) : Icônes utilisées dans l'interface utilisateur.

```

```
