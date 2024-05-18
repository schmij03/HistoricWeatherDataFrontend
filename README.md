
# HistoricWeatherDataFrontend

Dieses Frontend ermöglicht den Zugriff auf historische Wetterdaten und deren Visualisierung. Es bietet eine benutzerfreundliche Oberfläche, um Daten für bestimmte Standorte und Zeiträume abzufragen.

## Hauptfunktionen

- Datenabfrage: Auswahl von Standort, Datum.
- Visualisierung: Darstellung der Wetterdaten in Diagrammen und Tabellen.
- Export: Herunterladen der Daten im CSV oder JSON-Format.
- Responsives Design: Optimiert für Desktop und mobile Geräte.

## Installation & Ausführung

Voraussetzungen: Node.js und npm (oder yarn) müssen installiert sein.

1. Klonen: `git clone https://github.com/schmij03/HistoricWeatherDataFrontend.git`
2. Installation: `npm install` (oder `yarn install`)
3. Starten: `npm start` (oder `yarn start`)
4. Öffnen: Die Anwendung sollte automatisch in Ihrem Browser unter [http://localhost:3000](http://localhost:3000) geöffnet werden.

## Konfiguration

API-Endpoint: Die URL der Backend-API muss in der Konfigurationsdatei (z.B. `.env`) angegeben werden.

## Mögliche Erweiterungen (Optional)

- Erweiterte Filter: Zeitraumfilter, Filter nach Wettertypen, etc.
- Vergleichsfunktion: Vergleich von Wetterdaten verschiedener Standorte.
- Kartenintegration: Anzeige der Standorte auf einer Karte.
- Benutzerauthentifizierung: Schutz der Daten durch Anmeldung.
- Caching: Zwischenspeichern von Daten für schnellere Ladezeiten.

# Routes Web Application

## Übersicht

Dieses Projekt ist eine Webanwendung, die Wetterdaten über verschiedene Regionen und Stationen bereitstellt. In diesem Teil des Codes befinden sich nur die Frontend Komponenten.

## Verzeichnisstruktur

```
project-root/
├── server.js
├── assets/
│   ├── assets.js
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── jQuery.js
│   │   └── script.js
├── backend/
│   └── backend.js
├── routes/
│   ├── index.html
│   ├── regions.html
│   ├── routes.js
│   └── stations.html
```

## Dateien

- **server.js**: Das Hauptskript auf der Serverseite.
- **assets/**: Enthält statische Assets wie JavaScript, CSS und andere Frontend-Dateien.
  - **assets.js**: Allgemeines Asset-Skript.
  - **css/style.css**: Stylesheet für die Anwendung.
  - **js/jQuery.js**: jQuery-Bibliothek.
  - **js/script.js**: Benutzerdefinierter JavaScript-Code für die Anwendung.
- **backend/**: Enthält Backend-bezogene Skripte.
  - **backend.js**: Haupt-Backend-Skript.
- **routes/**: Enthält HTML- und routenbezogene JavaScript-Dateien.
  - **index.html**: Die Hauptstartseite.
  - **regions.html**: Seite zur Anzeige von Regionen.
  - **routes.js**: JavaScript zur Handhabung der Routenlogik.
  - **stations.html**: Seite zur Anzeige von Stationen.

## Installation & Ausführung

1. **Abhängigkeiten installieren**: Stellen Sie sicher, dass Node.js installiert ist. Führen Sie `npm install` aus, um die notwendigen Abhängigkeiten zu installieren.
2. **Server starten**: Führen Sie `node server.js` aus, um den Server zu starten.
3. **Anwendung öffnen**: Öffnen Sie einen Webbrowser und gehen Sie zu `http://localhost:3000`, um die Anwendung zu sehen.
