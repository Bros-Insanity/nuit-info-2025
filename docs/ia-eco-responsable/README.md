# Documentation IA Éco-Responsable

Une documentation web interactive et visuelle expliquant les modèles d'IA, leurs fondements mathématiques, et les enjeux de l'éco-responsabilité.

## 📋 Contenu

Cette documentation couvre :

1. **Modèles d'Intelligence Artificielle**
   - Réseaux de Neurones Artificiels (ANN)
   - Réseaux de Neurones Convolutifs (CNN)
   - Réseaux Récurrents (RNN/LSTM)
   - Transformers & Mécanisme d'Attention

2. **Éco-Responsabilité**
   - Impact environnemental des modèles d'IA
   - Solutions pour réduire la consommation énergétique
   - Comparaisons entre différents modèles
   - Bonnes pratiques

3. **LLM & Collecte de Données**
   - Qui collecte les données pour les LLM
   - Problèmes éthiques et légaux
   - Solutions éco-responsables spécifiques aux LLM
   - Impact croissant de l'inférence

## 🚀 Utilisation

### Ouvrir la documentation

Ouvrez simplement le fichier `index.html` dans un navigateur web moderne :

```bash
# Depuis le répertoire de la documentation
cd docs/ia-eco-responsable
# Ouvrir avec votre navigateur
firefox index.html
# ou
google-chrome index.html
# ou
xdg-open index.html
```

### Serveur local (recommandé)

Pour une meilleure expérience, servez la documentation via un serveur HTTP local :

```bash
# Avec Python 3
python3 -m http.server 8000

# Avec Node.js (si vous avez http-server installé)
npx http-server -p 8000

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

## 🎨 Fonctionnalités

- **Visualisations interactives** : Graphiques Chart.js pour illustrer les concepts
- **Formules mathématiques** : Rendu avec MathJax pour des équations claires
- **Design moderne** : Interface inspirée de Brilliant avec animations fluides
- **Responsive** : Adapté aux écrans desktop, tablette et mobile
- **Navigation fluide** : Scroll smooth et navigation par ancres

## 📦 Dépendances

Les dépendances sont chargées via CDN :

- **MathJax 3** : Rendu des formules mathématiques
- **Chart.js 4** : Graphiques interactifs
- **CSS moderne** : Animations et transitions CSS3

Aucune installation de dépendances n'est requise, tout fonctionne directement dans le navigateur.

## 📁 Structure

```
docs/ia-eco-responsable/
├── index.html          # Page principale
├── styles.css          # Styles et thème
├── visualizations.js   # Graphiques et visualisations
├── animations.js       # Animations et interactions
└── README.md          # Ce fichier
```

## 🔧 Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `styles.css` :

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
    /* ... */
}
```

### Ajouter des visualisations

Ajoutez de nouvelles fonctions dans `visualizations.js` et créez les éléments canvas correspondants dans `index.html`.

## 📊 Données

Les données présentées sont basées sur :
- Études académiques sur l'impact environnemental de l'IA
- Publications sur GPT-3, GPT-4, LLaMA, Mistral
- Rapports sur la consommation énergétique des data centers

**Note** : Certaines valeurs sont des estimations basées sur des données publiques disponibles.

## 🌱 Objectif

Cette documentation vise à :
- ✅ Éduquer sur les modèles d'IA et leurs mathématiques
- ✅ Sensibiliser à l'impact environnemental
- ✅ Proposer des solutions concrètes
- ✅ Encourager des pratiques plus durables

## 📝 Licence

Cette documentation fait partie du projet nuit-info-2025.

## 🤝 Contribution

Pour améliorer cette documentation :
1. Ajoutez des visualisations pour d'autres modèles
2. Mettez à jour les données d'impact environnemental
3. Améliorez les explications mathématiques
4. Ajoutez des exemples concrets

---

Fait avec 💚 pour un avenir plus durable

