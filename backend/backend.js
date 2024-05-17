// routes/users.js
const express = require('express');
const router = express.Router();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://weather:erhwLLotcHI8PTxj@weatherdata.zebph6n.mongodb.net/?retryWrites=true&w=majority&appName=WeatherData";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function getRegions() {
    const agg = [
        {
          '$group': {
            '_id': '$Region'
          }
        }
      ];
    const coll = client.db('BA').collection('WeatherData');
    const cursor = coll.aggregate(agg);
    //const result = await cursor.toArray();
    //console.log(result);
    return await cursor.toArray();;
};

async function getStations() {
  const agg = [
      {
        '$group': {
          '_id': '$Ort'
        }
      }
    ];
  const coll = client.db('BA').collection('WeatherData');
  const cursor = coll.aggregate(agg);
  //const result = await cursor.toArray();
  //console.log(result);
  return await cursor.toArray();;
};

async function getWeatherDataForRegion(region, dateFrom, dateTill){
  


    const agg = [
      { $match: { Region: region, 'Zeit': {
        '$gte': new Date(dateFrom), 
        '$lte': new Date(dateTill)
      },  } },  // Filter documents by the specified region
      { $project: { _id: 0 } },  // Project relevant fields
      { 
          $group: {
              _id: "$Zeit",  // Group by time
              average_temperature: { $avg: "$Temperatur" },  // Average temperature
              average_dew_point: { $avg: "$Taupunkt" },  // Average dew point
              average_weather_condition: { $first: "$Wetterbedingung" },  // Weather condition
              average_wind_direction: { $avg: "$Windrichtung" },  // Average wind direction
              average_humidity: { $avg: "$Luftfeuchtigkeit" },  // Average humidity
              average_precipitation: { $avg: "$Niederschlagsmenge (letzte Stunde)" },  // Average precipitation
              average_snowfall: { $avg: "$Schneefallmenge (letzte Stunde)" },  // Average snowfall
              average_wind_speed: { $avg: "$Windgeschwindigkeit" },  // Average wind speed
              average_wind_gust: { $avg: "$Windböen" },  // Average wind gust
              average_pressure: { $avg: "$Luftdruck" },  // Average pressure
              average_solar_radiation: { $avg: "$Sonneneinstrahlungsdauer" }  // Average solar radiation
          }
      },
      { $sort: { _id: 1 } }  // Sort by time
  ]

    const coll = client.db('BA').collection('WeatherData');
    const cursor = coll.aggregate(agg);
    //const result = await cursor.toArray();
    //console.log(result);
    return await cursor.toArray();;
}



async function getWeatherDataForStations(ort, dateFrom, dateTill){
  const agg = [
      {
        '$match': {
          'Zeit': {
            '$gte': new Date(dateFrom), 
            '$lte': new Date(dateTill)
          }, 
          'Ort': ort
        },  
      }
    ]
    const coll = client.db('BA').collection('WeatherData');
    const cursor = coll.aggregate(agg);
    //const result = await cursor.toArray();
    //console.log(result);
    return await cursor.toArray();;
}







// get all Regions grouped
router.get('/getRegions', (req, res) => {
    getRegions().then(function(result) {
        //console.log(result)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
});


//get all Stations grouped (Ort)
router.get('/getStations', (req, res) => {
  getStations().then(function(result) {
      //console.log(result)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
  });
});

router.get('/getRegionData', (req, res) => {
    var region = req.query.region;
    var dateFrom = req.query.dateFrom;
    var dateTill = req.query.dateTill;
    getWeatherDataForRegion(region, dateFrom, dateTill).then(function(result) {
      res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
});


router.get('/getStationsData', (req, res) => {
  var ort = req.query.ort;
  var dateFrom = req.query.dateFrom;
  var dateTill = req.query.dateTill;
  getWeatherDataForStations(ort, dateFrom, dateTill).then(function(result) {
    res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
  });
});


module.exports = router;