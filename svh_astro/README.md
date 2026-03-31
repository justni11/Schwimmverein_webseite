# SV Hockenheim – Webseite

Astro-Projekt für die GitHub Pages Website des SV Hockenheim e.V.

## Projektstruktur

```
/
├── .github/workflows/deploy.yml   ← Automatisches Deployment zu GitHub Pages
├── src/
│   ├── layouts/Layout.astro        ← Head, Header, Footer, Scripts (einmal definiert)
│   ├── components/
│   │   ├── Header.astro            ← Navigation (Desktop + Mobile)
│   │   └── Footer.astro            ← Footer mit Links
│   └── pages/
│       └── index.astro             ← Haupt-SPA mit allen Seiten-Divs
├── public/
│   ├── styles/global.css           ← Alle CSS-Stile (Dark/Light Mode, Layout, Komponenten)
│   ├── scripts/
│   │   ├── content.js              ← Statische Daten (Artikel, Vorstand, Rekorde, ...)
│   │   ├── carousel.js             ← Karussell-Logik
│   │   ├── navigation.js           ← Seitenwechsel, Hamburger-Menü
│   │   ├── admin-tools.js          ← Admin-Panel, Bild-Cropper, GitHub-Sync
│   │   └── main.js                 ← Kern-Utilities, News-Grid, Init
│   └── bilder/                     ← Bilder (werden von GitHub-Sync befüllt)
├── astro.config.mjs                ← Astro-Konfiguration (base URL!)
└── package.json
```

## Inhalte bearbeiten

- **Artikel, Vorstand, Rekorde:** `public/scripts/content.js`
- **CSS-Stile:** `public/styles/global.css`
- **Seiteninhalt:** `src/pages/index.astro`
- **Admin-Passwort:** `public/scripts/main.js` Zeile 1 (`var ADMIN_PW`)

## Lokal entwickeln

```bash
npm install
npm run dev
# Öffne http://localhost:4321/Vereinswebseite
```

## Deployment zu GitHub Pages

Einfach in den `main`-Branch pushen → GitHub Actions baut und deployed automatisch.
