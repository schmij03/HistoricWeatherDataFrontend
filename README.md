
# HistoricWeatherDataFrontend

Dieses Frontend ermöglicht den Zugriff auf historische Wetterdaten und deren Visualisierung. Es bietet eine benutzerfreundliche Oberfläche, um Daten für bestimmte Standorte und Zeiträume abzufragen.

## Hauptfunktionen

- Datenabfrage: Auswahl von Standort oder Region und Datum.
- Visualisierung: Darstellung der Wetterdaten in Diagrammen und Tabellen.
- Export: Herunterladen der Daten im CSV oder JSON-Format.
- Responsives Design: Optimiert für Desktop und mobile Geräte.

## Installation & Ausführung

Voraussetzungen: Node.js und npm (oder yarn) müssen installiert sein.

1. Klonen: `git clone https://github.com/schmij03/HistoricWeatherDataFrontend.git`
2. Installation: `npm install` (oder `yarn install`)
3. Starten: `npm start` (oder `yarn start`)
4. Öffnen: Die Anwendung sollte automatisch in Ihrem Browser unter [http://localhost:3000](http://localhost:3000) geöffnet werden.

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

## API-Anleitung

Die API (Application Programming Interface) ist eine Schnittstelle, über die verschiedene Softwaresysteme miteinander kommunizieren können. In diesem Fall ermöglicht die API den Zugriff auf Wetterdaten. Um diese Daten abzurufen, müssen Sie spezielle Anfragen stellen. Keine Sorge, das ist einfacher als es klingt!

### Was Sie brauchen:

- Einen Webbrowser: Sie können jeden gängigen Browser wie Chrome, Firefox oder Safari verwenden.
- Einen Texteditor: Ein einfacher Texteditor wie Notepad oder TextEdit reicht aus.

### So geht's:

1. **API-Endpunkt auswählen:**

    - Um alle verfügbaren Regionen zu sehen, verwenden Sie diesen Endpunkt:
      ```
      http://localhost:3000/backend/getRegions
      ```
    - Um alle verfügbaren Stationen zu sehen, verwenden Sie diesen Endpunkt:
      ```
      http://localhost:3000/backend/getStations
      ```
    - Um Wetterdaten für eine bestimmte Region abzurufen, verwenden Sie diesen Endpunkt:
      ```
      http://localhost:3000/backend/getData?type=region&location=Aargau&dateFrom=2024-05-17&dateTill=2024-05-18
      ```
    - Um Wetterdaten für eine bestimmte Station abzurufen, verwenden Sie diesen Endpunkt:
      ```
      http://localhost:3000/backend/getData?type=station&location=Baden&dateFrom=2024-05-17&dateTill=2024-05-18
      ```

2. **Endpunkt anpassen (nur für Wetterdaten):**

    - Ersetzen Sie bei den Endpunkten für Wetterdaten `Aargau` durch die gewünschte Region bzw. `StationName` durch den Namen der gewünschten Station/Region.
    - Ändern Sie die Datumsangaben (`dateFrom` und `dateTill`) auf den gewünschten Zeitraum.
    - Achten Sie darauf, das Format `YYYY-MM-DD` (Jahr-Monat-Tag) zu verwenden.

3. **Anfrage abschicken:**

    - **Methode 1: Webbrowser**
        - Kopieren Sie den gewünschten Endpunkt.
        - Fügen Sie ihn in die Adressleiste Ihres Browsers ein.
        - Drücken Sie Enter.
        - Die Wetterdaten sollten als Text im Browserfenster angezeigt werden.

    - **Methode 2: Texteditor**
        - Öffnen Sie Ihren Texteditor.
        - Fügen Sie den folgenden Text ein:
          ```
          curl -X GET "HIER_DEN_ENDPUNKT_EINFÜGEN"
          ```
        - Ersetzen Sie `HIER_DEN_ENDPUNKT_EINFÜGEN` durch den kopierten Endpunkt.
        - Speichern Sie die Datei mit der Endung `.bat` (z.B. `anfrage.bat`).
        - Doppelklicken Sie auf die Datei.
        - Ein neues Fenster sollte sich öffnen und die Wetterdaten anzeigen.

4. **Beispiel:**

    - Um Wetterdaten für Zürich vom 15. bis 16. Mai 2024 abzurufen, verwenden Sie folgenden Endpunkt:
      ```
      http://localhost:3000/backend/getData?type=station&location=Zürich&dateFrom=2024-05-15&dateTill=2024-05-16
      ```
