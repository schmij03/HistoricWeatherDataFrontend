var af = [""];
window.onload = function () {
  const currentUrl = window.location.href.split("/");
  var loc = currentUrl[currentUrl.length - 1];

  if (loc == "regions") {
    $.get('./backend/getRegions', function (data) {
      for (var i = 0; i < data.length; i++) {
        af.push(String(data[i]["_id"]));
      }
    });
    autocomplete(document.getElementById("regionInput"), af);
  } else if (loc == "stations") {
    $.get('./backend/getStations', function (data) {
      for (var i = 0; i < data.length; i++) {
        af.push(String(data[i]["_id"]));
      }
    });
    autocomplete(document.getElementById("stationInput"), af);
  }
}

$(document).on("click", "#getDataRegions", function () {
  var regionInput = $("#regionInput").val();
  var dateFrom = $("#dateFrom").val();
  var dateTill = $("#dateTill").val();
  var df = new Date(dateFrom);
  var dt = new Date(dateTill);
  var today = new Date();

  if (df > dt) {
    alert("Das Startdatum darf nicht größer als das Enddatum sein.");
    return;
  }
  if (dt > today) {
    alert("Das Enddatum darf nicht in der Zukunft liegen.");
    return;
  }

  $.get('./backend/getRegionData?region=' + regionInput + '&dateFrom=' + df + '&dateTill=' + dt, function (response) {
    console.log('Received data:', response);
    if (response && response.length > 0) {
      const columns = Object.keys(response[0]);
      buildTable(columns, response);
      buildGraph(response);
    } else {
      console.error('Invalid response format:', response);
    }
  });
});

$(document).on("click", "#getDataStations", function () {
  var stationInput = $("#stationInput").val();
  var dateFrom = $("#dateFrom").val();
  var dateTill = $("#dateTill").val();
  var df = new Date(dateFrom);
  var dt = new Date(dateTill);
  var today = new Date();

  if (df > dt) {
    alert("Das Startdatum darf nicht größer als das Enddatum sein.");
    return;
  }
  if (dt > today) {
    alert("Das Enddatum darf nicht in der Zukunft liegen.");
    return;
  }

  $.get('./backend/getStationsData?ort=' + stationInput + '&dateFrom=' + df + '&dateTill=' + dt, function (response) {
    console.log('Received data:', response);
    if (response && response.length > 0) {
      const columns = Object.keys(response[0]);
      buildTable(columns, response);
      buildGraph(response);
    } else {
      console.error('Invalid response format:', response);
    }
  });
});

function buildTable(columns, data) {
  var tableHeader = "<tr>";
  columns.forEach(column => {
    tableHeader += "<th>" + column + "</th>";
  });
  tableHeader += "</tr>";

  var tableBody = "";
  data.forEach(item => {
    tableBody += "<tr>";
    columns.forEach(column => {
      tableBody += "<td>" + (item[column] !== undefined ? item[column] : 'N/A') + "</td>";
    });
    tableBody += "</tr>";
  });

  console.log('Table Header:', tableHeader);
  console.log('Table Body:', tableBody);

  $("thead").html(tableHeader);
  $("tbody").html(tableBody);
}

function buildGraph(data) {
  const xValues = [];
  const yValues = [];
  data.forEach(item => {
    xValues.push(item["_id"] ? new Date(item["_id"]).toLocaleString() : '');
    yValues.push(item["average_temperature"]);
  });

  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        data: yValues,
        borderColor: "red",
        fill: false
      }]
    },
    options: {
      legend: { display: false }
    }
  });
}

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
