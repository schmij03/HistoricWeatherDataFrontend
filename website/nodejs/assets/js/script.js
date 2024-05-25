window.onload = function () {
  // Die aktuelle URL wird geteilt, um den letzten Teil (die Seite) zu extrahieren
  const currentUrl = window.location.href.split("/");
  var loc = currentUrl[currentUrl.length - 1];
  var inputId = loc === "regions" ? "regionInput" : "stationInput";
  var getDataButtonId = loc === "regions" ? "getDataRegions" : "getDataStations";
  var endpoint = loc === "regions" ? './backend/getRegions' : './backend/getStations';
  var autocompleteData = [];
  var allrows = [];
  var allcolumns = [];
  var locationInput;
  
  // Setzt das heutige Datum in den entsprechenden Eingabefeldern
  setTodayDate();
  // Initialisiert das Dropdown-Feld mit Daten vom Server
  initializeSelect(endpoint, inputId);

  // Event-Listener für den Button-Klick, um Daten zu holen
  $(document).on("click", "#" + getDataButtonId, function () {
      var locationInput = $("#" + inputId).val();
      var dateFrom = $("#dateFrom").val();
      var dateTill = $("#dateTill").val();
      var type = loc === "regions" ? "region" : "station";

      // Überprüfung, ob das Startdatum größer als das Enddatum ist
      if (new Date(dateFrom) > new Date(dateTill)) {
          alert("Das Startdatum darf nicht größer als das Enddatum sein.");
          return;
      }
      // Überprüfung, ob das Enddatum in der Zukunft liegt
      if (new Date(dateTill) > new Date()) {
          alert("Das Enddatum darf nicht in der Zukunft liegen.");
          return;
      }

      // AJAX-Anfrage, um Daten vom Server zu holen
      $.get(`./backend/getData?type=${type}&location=${locationInput}&dateFrom=${dateFrom}&dateTill=${dateTill}`, function (response) {
          if (response && response.length > 0) {
              const columns = Object.keys(response[0]);
              // Erstellt die Tabelle und den Graphen mit den erhaltenen Daten
              buildTable(columns, response);
              buildGraph(response);
          } else {
              alert("Keine Daten verfügbar für: "+locationInput+" in dem angegebenen Zeitraum gefunden.");
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
          alert("Fehler beim Abrufen der Daten: " + textStatus);
      });
  });
};

// Funktion zur Umwandlung der Windrichtung von Grad in Himmelsrichtungen
function convertWindDirection(degrees) {
  if (degrees === null || degrees === undefined || isNaN(degrees)) {
    return 'Unbekannt';
  }
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

// Funktion zur Setzung des heutigen Datums in den Datumsfeldern
function setTodayDate() {
  const today = new Date();
  const day = ('0' + today.getDate()).slice(-2);
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  $('#dateFrom').val(formattedDate);
  $('#dateTill').val(formattedDate);
}

// Mapping für Wetterbedingungen
const weatherMapping = {
  1: "Klar",
  2: "Heiter",
  3: "Bewölkt",
  4: "Bedeckt",
  5: "Nebel",
  6: "Gefrierender Nebel",
  7: "Leichter Regen",
  8: "Regen",
  9: "Starker Regen",
  10: "Gefrierender Regen",
  11: "Starker gefrierender Regen",
  12: "Schneeregen",
  13: "Starker Schneeregen",
  14: "Leichter Schneefall",
  15: "Schneefall",
  16: "Starker Schneefall",
  17: "Regenschauer",
  18: "Starker Regenschauer",
  19: "Graupelschauer",
  20: "Starker Graupelschauer",
  21: "Schneeschauer",
  22: "Starker Schneeschauer",
  23: "Blitz",
  24: "Hagel",
  25: "Gewitter",
  26: "Starker Gewitter",
  27: "Sturm"
};

// Mapping für Föhnindex
const foehnindex = {
  0: "kein Föhn",
  1: "Föhnmischluft",
  2: "Föhn"
};

// Funktion zum Erstellen der Tabelle
function buildTable(columns, data) {
  allData = data;
  allColumns = columns;
  var tableHeader = "<tr>";
  columns.forEach(column => {
    if (column === "_id") {
      column = "Datum";
    }
    tableHeader += "<th>" + column + "</th>";
  });
  tableHeader += "</tr>";

  var tableBody = "";
  // Anzeige der ersten 5 Zeilen
  data.slice(0, 5).forEach(item => {
    tableBody += "<tr>";
    columns.forEach((column, index) => {
      let cellValue = item[column];
      if (column === "Wetterbedingung") {
        cellValue = weatherMapping[parseInt(cellValue)] || 'Unbekannt';
      } else if (column === "Föhnindex") {
        cellValue = foehnindex[cellValue] || 'Unbekannt';
      } else if (column === "Windrichtung") {
        cellValue = convertWindDirection(cellValue);
      } else if (typeof cellValue === 'number') {
        cellValue = cellValue.toFixed(2);
      } else if (index === 0) {
        cellValue = cellValue ? new Date(cellValue).toLocaleString() : 'N/A';
      } else {
        cellValue = cellValue !== undefined ? cellValue : 'N/A';
      }
      tableBody += "<td>" + cellValue + "</td>";
    });
    tableBody += "</tr>";
  });

  $("#meineTabelleId thead").html(tableHeader);
  $("#meineTabelleId tbody").html(tableBody);

  document.getElementById('exportFormatSelect').disabled = false;
}

// Funktion zum Erstellen der Graphen
function buildGraph(data) {
  $('#graphs').empty();
  const fields = Object.keys(data[0]);
  const excludeFields = ["_id", "Land", "Koordinaten", "Region", "Station", "Wetterbedingung", "Windrichtung", "Föhnindex"];
  const validFields = fields.filter(field => !excludeFields.includes(field));

  let row;
  validFields.forEach((field, index) => {
    const xValues = [];
    const yValues = [];

    data.forEach(item => {
      if (item[field] !== null && item[field] !== undefined) {
        let value = item[field];
        if (field === "Wetterbedingung") {
          value = weatherMapping[value] || 'Unbekannt';
        } else if (typeof value === 'number') {
          value = value.toFixed(2);
        }
        yValues.push(value);
        xValues.push(item["_id"] ? new Date(item["_id"]).toLocaleString() : '');
      }
    });

    if (yValues.length > 0) {
      if (index % 2 === 0) {
        row = $('<div class="row"></div>');
        $('#graphs').append(row);
      }

      const col = $('<div class="col-md-6"></div>');
      const canvasId = `chart-${field}`;
      col.append(`<canvas id="${canvasId}" style="width:100%;max-width:600px;"></canvas>`);
      row.append(col);

      new Chart(canvasId, {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            label: field,
            data: yValues,
            borderColor: getRandomColor(),
            fill: false
          }]
        },
        options: {
          legend: { display: true }
        }
      });
    }
  });
}

// Funktion zur Generierung einer zufälligen Farbe
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Autocomplete-Funktion für das Eingabefeld
function autocomplete(inp, arr) {
  let currentFocus;
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);

    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function(e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

// Setzt das aktive Element in der Autocomplete-Liste
function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("autocomplete-active");
}

// Entfernt das aktive Element in der Autocomplete-Liste
function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

// Schließt alle Autocomplete-Listen
function closeAllLists(elmnt, inp) {
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

// Funktion zum Herunterladen der Tabelle als CSV-Datei
function downloadTableAsCSV(columns, rows) {
  var csv = [];
  csv.push(columns.join(','));
  rows.forEach(row => {
    var csvRow = [];
    columns.forEach(column => {
      var data = row[column] ? row[column].toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s+)/gm, ' ') : '';
      data = data.replace(/"/g, '""');
      csvRow.push('"' + data + '"');
    });
    csv.push(csvRow.join(','));
  });

  var csvString = csv.join('\n');
  var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "export.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Funktion zum Exportieren der Daten als CSV oder JSON
function exportData(format) {  
  if (format === 'csv') {
    downloadTableAsCSV(allColumns, allData);
  } else if (format === 'json') {
    downloadTableAsJSON(allColumns, allData);
  }
}

// Funktion zum Herunterladen der Tabelle als JSON-Datei
function downloadTableAsJSON(columns, data) {
  var jsonData = [];
  var headers = columns;

  data.forEach(row => {
    var rowData = {};
    columns.forEach(column => {
      rowData[column] = row[column] ? row[column].toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s+)/gm, ' ') : '';
    });
    jsonData.push(rowData);
  });

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
  var downloadLink = document.createElement('a');
  downloadLink.href = dataStr;
  downloadLink.download = "data.json";
  downloadLink.click();
}

// Initialisiert das Select2 Dropdown-Feld mit Daten vom Server
function initializeSelect(endpoint, inputId) {
  var autofillElements = [" "];
  $.get(endpoint, function (data) {
      var formattedData = data.map(item => {
        if(item._id != null){
          autofillElements.push(item._id); 
        }
        return { id: item._id, text: item._id };
      });
      autocomplete(document.getElementById(inputId), autofillElements);
  });
}
