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
- **CSS3** : Styling moderne avec animations et effets visuels
- **JavaScript (ES6+)** : Logique du jeu et algorithme IA
- **LocalStorage** : Sauvegarde des scores

## 🎯 Structure du projet

```
MorpionX/
│
├── index.html      # Structure HTML du jeu
├── style.css       # Styles et animations
├── app.js          # Logique du jeu et IA
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

## 🔮 Améliorations futures

- [ ] Niveaux de difficulté pour l'IA (facile/moyen/difficile)
- [ ] Mode multijoueur en ligne (WebSockets)
- [ ] Sons et effets sonores
- [ ] Thèmes personnalisables
- [ ] Historique des parties
- [ ] Statistiques détaillées
- [ ] Grilles alternatives (4x4, 5x5)
- [ ] Mode tournoi

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

