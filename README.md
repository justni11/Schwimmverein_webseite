# SV Hockenheim Webseite

## Projektstruktur

```
/
├── index.html              ← HTML-Skelett + Seiteninhalt
├── css/
│   ├── variables.css       ← CSS-Variablen, Dark/Light Mode
│   ├── layout.css          ← Header, Nav, Footer, Hero, Grid
│   └── components.css      ← Cards, Karussell, Tabellen, Modale, Admin
├── js/
│   ├── navigation.js       ← Seitenwechsel, Hamburger-Menü, Dropdowns
│   ├── carousel.js         ← Karussell-Logik + Auto-Advance
│   ├── admin-tools.js      ← Admin-Panel, News-Editor, Image-Cropper, GitHub-Sync
│   └── main.js             ← Kern-Utilities, News-Grid, Init
├── data/
│   └── content.js          ← Statische Inhalte (Artikel, Vorstand, Rekorde, ...)
└── images/                 ← Lokale Bilder (Bilder kommen per GitHub-Sync)
```

## Lokale Entwicklung

Einfach `index.html` im Browser öffnen – kein Build-Schritt nötig.

**Wichtig:** Wegen `fetch()`-Aufrufen für GitHub-Sync am besten über einen
lokalen Server öffnen:
```bash
# Mit Python:
python3 -m http.server 8080
# Dann: http://localhost:8080
```

## GitHub Pages Deployment

Alle Dateien in den `main`-Branch pushen – GitHub Pages lädt automatisch `index.html`.

## Daten bearbeiten

Statische Inhalte (News-Artikel, Vorstand, Trainingszeiten, Rekorde) sind in
`data/content.js` ausgelagert. Dort einfach die Objekte anpassen.

## Admin-Passwort

Das Admin-Passwort steht in `js/main.js` in der ersten Zeile (`const ADMIN_PW`).
