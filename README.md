# HistoricWeatherDataFrontend

Dieses Frontend ermöglicht den Zugriff auf historische Wetterdaten und deren Visualisierung. Es bietet eine benutzerfreundliche Oberfläche, um Daten für bestimmte Standorte und Zeiträume abzufragen.

## Hauptfunktionen

- Datenabfrage: Auswahl von Standort, Datum und Wetterparametern (Temperatur, Niederschlag, etc.).
- Visualisierung: Darstellung der Wetterdaten in Diagrammen und Tabellen.
- Export: Herunterladen der Daten im CSV-Format.
- Responsives Design: Optimiert für Desktop und mobile Geräte.

## Technologien

- Frontend: React, TypeScript, Recharts (oder eine ähnliche Charting-Bibliothek), Material-UI (oder ein ähnliches UI-Framework)
- Backend-Integration: Axios (oder eine ähnliche HTTP-Client-Bibliothek) zur Kommunikation mit einer REST-API, die die Wetterdaten bereitstellt.
- State Management: Redux (oder eine ähnliche Bibliothek) zur Verwaltung des Anwendungszustands.

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