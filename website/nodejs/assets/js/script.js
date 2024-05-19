window.onload = function () {
  const currentUrl = window.location.href.split("/");
  var loc = currentUrl[currentUrl.length - 1];
  var inputId = loc === "regions" ? "regionInput" : "stationInput";
  var getDataButtonId = loc === "regions" ? "getDataRegions" : "getDataStations";
  var endpoint = loc === "regions" ? './backend/getRegions' : './backend/getStations';
  var autocompleteData = [];
  
  setTodayDate();
    // Initialize Select2 for input
  initializeSelect2(endpoint, inputId);

  $(document).on("click", "#" + getDataButtonId, function () {
      var locationInput = $("#" + inputId).select2('data')[0] ? $("#" + inputId).select2('data')[0].text : '';
      var dateFrom = $("#dateFrom").val();
      var dateTill = $("#dateTill").val();
      var type = loc === "regions" ? "region" : "station";
      console.log("Date From Value: ", $('#dateFrom').val()); // Verify if the date is set correctly
      console.log("Date Till Value: ", $('#dateTill').val());
      console.log("Sending request with:", type, locationInput, dateFrom, dateTill);

      if (new Date(dateFrom) > new Date(dateTill)) {
          alert("Das Startdatum darf nicht größer als das Enddatum sein.");
          return;
      }
      if (new Date(dateTill) > new Date()) {
          alert("Das Enddatum darf nicht in der Zukunft liegen.");
          return;
      }

      $.get(`./backend/getData?type=${type}&location=${locationInput}&dateFrom=${dateFrom}&dateTill=${dateTill}`, function (response) {
          if (response && response.length > 0) {
              const columns = Object.keys(response[0]);
              buildTable(columns, response);
              buildGraph(response);
          } else {
              console.error('Invalid response format:', response);
              alert("Keine Daten verfügbar für: "+locationInput+" in dem angegebenen Zeitraum gefunden.");
          }
      }).fail(function (jqXHR, textStatus, errorThrown) {
          console.error("Request failed: " + textStatus + ", " + errorThrown);
          alert("Fehler beim Abrufen der Daten: " + textStatus);
      });
  });
};
function convertWindDirection(degrees) {
  if (degrees === null || degrees === undefined || isNaN(degrees)) {
    return 'Unbekannt';
  }
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

function initializeSelect2(endpoint, inputId) {
    $.get(endpoint, function (data) {
        var formattedData = data.map(item => {
            return { id: item._id, text: item._id };
        });
        $('#' + inputId).select2({
            data: formattedData,
            placeholder: "Wähle eine Option",
            allowClear: true,
            tags: true // Allows the creation of new entries
        });
    });
}
function setTodayDate() {
  const today = new Date();
  const day = ('0' + today.getDate()).slice(-2);
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`; // Änderung hier für das korrekte Format

  $('#dateFrom').val(formattedDate);
  $('#dateTill').val(formattedDate);
}
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

const foehnindex={
  0: "kein Föhn",
  1: "Föhnmischluft",
  2: "Föhn",
}

function buildTable(columns, data) {
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

  // Button aktivieren, wenn die Tabelle erstellt wurde
  document.getElementById('exportFormatSelect').disabled = false;
}

function buildGraph(data) {
  $('#graphs').empty(); // Leeren des Graph-Containers vor dem Hinzufügen neuer Graphen
  const fields = Object.keys(data[0]);
  const excludeFields = ["_id", "Land", "Koordinaten", "Region", "Station", "Wetterbedingung", "Windrichtung"];
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

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



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

function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

function closeAllLists(elmnt, inp) {
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

function downloadTableAsCSV(tableId) {
  var table = document.getElementById(tableId);
  var rows = table.querySelectorAll('tr');
  var csv = [];

  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll('td, th');
      
      for (var j = 0; j < cols.length; j++) {
          // Bereinige den Textinhalt und umschließe ihn mit Anführungszeichen,
          // um Komplikationen durch Kommas in den Daten zu vermeiden.
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s+)/gm, ' ');
          data = data.replace(/"/g, '""'); // Verdopple Anführungszeichen.
          row.push('"' + data + '"');
      }
      csv.push(row.join(','));
  }

  // Erzeuge eine CSV-Datei und starte den Download.
  var csvString = csv.join('\n');
  var blob = new Blob([csvString], { type: 'text/csv;charset=latin9;' });
  var url = URL.createObjectURL(blob);
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "export.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
function exportData(format) {
  const tableId = 'meineTabelleId';
  if (format === 'csv') {
    downloadTableAsCSV(tableId);
  } else if (format === 'json') {
    downloadTableAsJSON(tableId);
  }
}
function downloadTableAsJSON(tableId) {
  var table = document.getElementById(tableId);
  var rows = table.querySelectorAll('tr');
  var jsonData = [];
  var headers = [];

  rows[0].querySelectorAll('th').forEach(header => {
    headers.push(header.innerText);
  });

  for (var i = 1; i < rows.length; i++) {
    var row = {}, cols = rows[i].querySelectorAll('td');
    cols.forEach((col, index) => {
      row[headers[index]] = col.innerText;
    });
    jsonData.push(row);
  }

  var dataStr = "data:text/json;charset=latin9," + encodeURIComponent(JSON.stringify(jsonData));
  var downloadLink = document.createElement('a');
  downloadLink.href = dataStr;
  downloadLink.download = "data.json";
  downloadLink.click();
}
