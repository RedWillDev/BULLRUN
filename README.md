<div align="center">

```
██████╗ ██╗   ██╗██╗     ██╗     ██████╗ ██╗   ██╗███╗   ██╗
██╔══██╗██║   ██║██║     ██║     ██╔══██╗██║   ██║████╗  ██║
██████╔╝██║   ██║██║     ██║     ██████╔╝██║   ██║██╔██╗ ██║
██╔══██╗██║   ██║██║     ██║     ██╔══██╗██║   ██║██║╚██╗██║
██████╔╝╚██████╔╝███████╗███████╗██║  ██║╚██████╔╝██║ ╚████║
╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

**Surveillance automatique des marchés publics français en temps réel**

![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite&logoColor=white)
![PapaParse](https://img.shields.io/badge/PapaParse-5.x-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)

</div>

---

## 🐂 À propos

**BULLRUN** est une interface de veille des appels d'offres publics français. Elle consomme un export CSV horodaté issu d'une plateforme de marchés publics (ex : BOAMP, AWS Achat, collectivités), le parse côté client et expose les offres dans une UI dark premium avec rafraîchissement automatique toutes les 5 minutes.

Aucun backend requis — tout tourne dans le navigateur.

---

## ✨ Fonctionnalités

- **Lecture CSV** — parsing en-tête automatique, normalisation des clés, délimiteur `;`
- **Recherche instantanée** — filtre en temps réel sur l'objet du marché et l'acheteur
- **Rafraîchissement automatique** — rechargement du CSV toutes les 5 minutes sans rechargement de page
- **UI dark premium** — glassmorphism, orbes de fond animées, grille CSS, micro-interactions
- **Responsive** — grille auto-fit, layout mobile adapté
- **Zéro dépendance serveur** — fonctionne en simple `static file serving`

---

## 🚀 Démarrage rapide

```bash
# Cloner le dépôt
git clone https://github.com/ton-user/bullrun.git
cd bullrun

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Placer le fichier CSV exporté à la racine du dossier `public/` :

```
public/
└── central_marches_20260519_101424.csv
```

---

## 📁 Structure du projet

```
bullrun/
├── public/
│   └── central_marches_*.csv     # Export CSV des marchés publics
├── src/
│   ├── components/
│   │   └── MarketplaceView.vue   # Composant principal
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

---

## 📄 Format CSV attendu

Le fichier CSV doit utiliser `;` comme délimiteur et comporter au minimum les colonnes suivantes :

| Colonne | Alias acceptés | Description |
|---|---|---|
| `objet` | `titre`, `description` | Intitulé du marché |
| `acheteur` | — | Nom de l'entité acheteuse |
| `date_limite` | — | Date limite de remise des offres |
| `lien` | `url` | URL vers l'avis complet |

Les noms de colonnes sont normalisés automatiquement (trim + lowercase).

---

## 🛠️ Stack technique

| Outil | Rôle |
|---|---|
| [Vue 3](https://vuejs.org/) + Composition API | Framework UI |
| [Vite](https://vitejs.dev/) | Bundler / dev server |
| [PapaParse](https://www.papaparse.com/) | Parsing CSV côté client |
| CSS Scoped + custom properties | Styles — aucun framework CSS |

---

## 📜 Licence

MIT — libre d'utilisation, de modification et de distribution.

---

<div align="center">
  <sub>Fait avec 🐂 et beaucoup de café</sub>
</div>
