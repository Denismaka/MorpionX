# 🎮 MorpionX

Un jeu de Morpion (Tic Tac Toe) moderne et interactif développé en HTML, CSS et JavaScript vanilla.

> **MorpionX** - Où le classique rencontre la modernité. Un jeu de stratégie élégant avec IA intelligente et design contemporain.

## ✨ Fonctionnalités

### 🎯 Mode de jeu
- **Mode Multijoueur** : Jouez à deux joueurs sur le même écran
- **Mode Solo** : Défiez l'IA intelligente (algorithme Minimax)

### 🎨 Interface utilisateur
- Design moderne avec dégradé et effet glassmorphism
- Animations fluides et transitions élégantes
- Interface responsive (adaptée mobile, tablette et desktop)
- Mise en évidence de la ligne gagnante
- Indicateur visuel du joueur actif

### 📊 Statistiques
- Compteur de scores persistant (sauvegardé dans le navigateur)
- Affichage des scores pour chaque joueur
- Bouton de redémarrage rapide

### 🎪 Expérience utilisateur
- Feedback visuel immédiat
- Messages clairs pour les victoires et matchs nuls
- Couleurs distinctes pour chaque joueur (X en rouge, O en cyan)
- Animations lors des coups et des victoires

## 🚀 Installation

### Installation simple (mode solo/local)

1. Clonez le dépôt :
```bash
git clone https://github.com/Denismaka/MorpionX.git
```

2. Ouvrez le fichier `index.html` dans votre navigateur web

Ou utilisez un serveur local (recommandé) :
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000` dans votre navigateur.

### Installation complète (avec mode multijoueur en ligne)

1. Clonez le dépôt :
```bash
git clone https://github.com/Denismaka/MorpionX.git
cd MorpionX
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur :
```bash
npm start
```

4. Accédez à `http://localhost:3000` dans votre navigateur

Le serveur sera disponible sur le port 3000 (ou le port spécifié dans la variable d'environnement PORT).

## 📖 Utilisation

### Mode Multijoueur
1. Cliquez sur une case vide pour jouer
2. Les joueurs alternent automatiquement entre X et O
3. Le premier à aligner 3 symboles gagne !

### Mode Solo
1. Cliquez sur le bouton "🤖 Mode Solo"
2. Vous jouez X, l'IA joue O
3. L'IA utilise une stratégie intelligente pour vous défier

### Contrôles
- **Nouvelle partie** : Cliquez sur "🔄 Nouvelle partie" pour recommencer
- **Changer de mode** : Utilisez le bouton de mode pour basculer entre Solo et Multijoueur

## 🛠️ Technologies utilisées

- **HTML5** : Structure du jeu
- **CSS3** : Styling moderne avec animations, effets visuels et thèmes personnalisables
- **JavaScript (ES6+)** : Logique du jeu et algorithme IA
- **LocalStorage** : Sauvegarde des scores, statistiques et historique
- **Web Audio API** : Sons et effets sonores
- **Socket.IO** : Mode multijoueur en ligne en temps réel
- **Node.js + Express** : Serveur pour le mode multijoueur en ligne

## 🎯 Structure du projet

```
MorpionX/
│
├── index.html      # Structure HTML du jeu
├── style.css       # Styles, animations et thèmes
├── app.js          # Logique du jeu, IA et toutes les fonctionnalités
├── server.js       # Serveur WebSocket pour le mode multijoueur en ligne
├── package.json    # Dépendances Node.js
├── .gitignore      # Fichiers à ignorer par Git
└── README.md       # Documentation
```

## 🧠 Algorithme IA

L'IA utilise une stratégie basée sur l'algorithme Minimax :
- Priorité 1 : Gagner si possible
- Priorité 2 : Bloquer le joueur s'il peut gagner
- Priorité 3 : Prendre le centre
- Priorité 4 : Prendre un coin
- Priorité 5 : Prendre une case disponible

## 🎨 Personnalisation

Vous pouvez facilement personnaliser :
- Les couleurs dans `style.css` (variables de couleurs)
- La difficulté de l'IA dans `app.js` (fonction `getBestMove`)
- Les animations et effets dans `style.css`

## 📱 Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Navigateurs mobiles (iOS/Android)

## ✨ Nouvelles fonctionnalités (v2.0)

Toutes les améliorations futures ont été implémentées ! 🎉

### 🎮 Niveaux de difficulté IA
- **Facile** : L'IA fait parfois des erreurs stratégiques
- **Moyen** : L'IA utilise une stratégie équilibrée (par défaut)
- **Difficile** : L'IA utilise l'algorithme Minimax pour des coups optimaux

### 🌐 Mode multijoueur en ligne
- Jouez avec des amis en temps réel via WebSockets
- Créez ou rejoignez des salles de jeu
- Synchronisation en temps réel des coups
- **Note** : Nécessite le serveur Node.js en cours d'exécution

### 🔊 Sons et effets sonores
- Sons pour chaque coup joué
- Musique de victoire
- Son pour les matchs nuls
- Activation/désactivation dans les paramètres

### 🎨 Thèmes personnalisables
- **Défaut** : Dégradé violet classique
- **Sombre** : Thème sombre élégant
- **Clair** : Thème clair et lumineux
- **Océan** : Tons bleus et verts
- **Forêt** : Tons verts naturels
- **Coucher de soleil** : Tons roses et oranges

### 📜 Historique des parties
- Conserve les 50 dernières parties
- Affiche le gagnant, la taille de grille et la durée
- Filtrage par résultat (victoire X, O ou match nul)

### 📊 Statistiques détaillées
- Nombre total de parties jouées
- Victoires par joueur (X et O)
- Matchs nuls
- Taux de victoire pour chaque joueur
- Série de victoires la plus longue
- Temps de jeu total

### 🎯 Grilles alternatives
- **3x3** : Grille classique (par défaut)
- **4x4** : Grille moyenne pour plus de stratégie
- **5x5** : Grande grille pour des parties plus longues

### 🏆 Mode tournoi
- Suivez les scores sur plusieurs parties
- Statistiques de tournoi séparées
- Réinitialisation facile pour recommencer

## 🔮 Améliorations futures

Toutes les fonctionnalités prévues ont été implémentées ! 🎊

## 📝 Licence

Ce projet est open source et disponible sous licence MIT.

## 👨‍💻 Auteur

**Denis Maka**

Développeur passionné par les technologies web modernes.

## 📬 Contact

Pour toute question, collaboration ou devis :

- **Email** : makadenis370@gmail.com
- **Téléphone** : +243 818 252 385 / +243 997 435 030
- **Réseaux sociaux** :
  - [Twitter](https://twitter.com/MakaDenis3)
  - [LinkedIn](https://www.linkedin.com/in/Denismaka)
  - [GitHub](https://github.com/Denismaka)
  - [Facebook](https://www.facebook.com/Denismaka)

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !

