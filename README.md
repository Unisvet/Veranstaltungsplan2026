# Veranstaltungsplan 2026 🗓️🍂

Eine moderne, responsive Webanwendung für den Veranstaltungsplan 2026 des Ortes Klingmühl.

## 🗂️ Daten Bearbeiten (ohne Programmieren)

Alle Veranstaltungsdaten liegen in **einer einzigen Datei**, damit sie schnell und einfach aktualisiert werden können.
1. Öffne die Datei `public/events.json`.
2. Hier findest du eine Liste an Veranstaltungen. Du kannst Datum, Titel, Zeitfenster, Ort und auch die Kurzbeschreibung anpassen.
3. Speichere die Datei. Beim Neuladen der Webseite übernehmen sich die Änderungen direkt.

## 🚀 Deployment Phase 1: GitHub Pages (Statisch)

Aktuell läuft das Projekt vollständig lokal im Browser. Es kann komplett kostenlos auf GitHub Pages gehostet werden.
1. Pushe diesen Code in ein neues öffentliches GitHub-Repository.
2. In den GitHub-Repository Settings: Gehe auf **Pages**.
3. Stelle als Source **GitHub Actions** ein. GitHub erkennt automatisch das Vite/React-Framework und baut die Seite. *Alternative*: Nutze folgendes Build-Script in deiner `package.json`: `"deploy": "gh-pages -d dist"` und nutze das `gh-pages` npm package.
4. Fertig! Die Seite ist online.

## ☁️ Deployment Phase 2: Google Cloud Run (Container)

Wenn zukünftig echte Foto-Uploads oder eine Datenbank angeschlossen werden sollen, wird die App auf **Google Cloud Run** umgezogen. Code und Struktur dafür liegen bereits parat.

### Cloud Run Deployment-Schritte:
1. Cloud SDK (gcloud) installieren und authentifizieren.
2. Build Image und Push in die Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJEKT_ID]/veranstaltungsplan
   ```
3. Deploy auf Cloud Run:
   ```bash
   gcloud run deploy veranstaltungsplan \
     --image gcr.io/[PROJEKT_ID]/veranstaltungsplan \
     --platform managed \
     --region europe-west3 \
     --allow-unauthenticated \
     --port 8080
   ```

### 🌉 API für Bilder-Upload anschließen:
Schau in die Datei `src/components/PhotoModal.jsx`. 
Dort findest du einen großen Kommentar `IMPORTANT NOTE FOR BACKEND MIGRATION`. Wenn ein Backend läuft, tauschst du die `URL.createObjectURL(file)` Mock-Logik einfach gegen einen Payload an dein Google Cloud Storage API aus.
