const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const router = express.Router();

const uri = "mongodb+srv://weather:erhwLLotcHI8PTxj@weatherdata.zebph6n.mongodb.net/?retryWrites=true&w=majority&appName=WeatherData";
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

async function getWeatherData(type, locationValue, dateFrom, dateTill) {
  try {
    const fromDate = new Date(dateFrom);
    const tillDate = new Date(dateTill);
    const filter = type === 'region' ? 'Region' : 'Ort';

    const agg = [
      {
        '$match': {
          [filter]: locationValue,
          'Zeit': {
            '$gte': fromDate,
            '$lte': tillDate
          }
        }
      },
      { '$project': { '_id': 0 } },
      {
        '$group': {
          '_id': "$Zeit",
          average_temperature: { '$avg': "$Temperatur" },
          average_dew_point: { '$avg': "$Taupunkt" },
          average_weather_condition: { $first: "$Wetterbedingung" },
          average_wind_direction: { '$avg': "$Windrichtung" },
          average_humidity: { '$avg': "$Luftfeuchtigkeit" },
          average_precipitation: { '$avg': "$Niederschlagsmenge (letzte Stunde)" },
          average_snowfall: { '$avg': "$Schneefallmenge (letzte Stunde)" },
          average_wind_speed: { '$avg': "$Windgeschwindigkeit" },
          average_wind_gust: { '$avg': "$Windböen" },
          average_pressure: { '$avg': "$Luftdruck" },
          average_solar_radiation: { '$avg': "$Sonneneinstrahlungsdauer" },
          average_global_radiation: { '$avg': "$Globalstrahlung" },
          average_pressure_sea_level: { '$avg': "$Luftdruck reduziert auf Meeresniveau" },
          average_pressure_sea_level_standard: { '$avg': "$Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre" },
          average_geopotential_height_850hPa: { '$avg': "$Geopotentielle Höhe der 850 hPa-Fläche" },
          average_geopotential_height_700hPa: { '$avg': "$Geopotentielle Höhe der 700 hPa-Fläche" },
          average_wind_direction_vector: { '$avg': "$Windrichtung vektoriell" },
          average_wind_speed_tower: { '$avg': "$Windgeschwindigkeit Turm" },
          average_wind_gust_tower: { '$avg': "$Böenspitze Turm" },
          average_temperature_instrument1: { '$avg': "$Lufttemperatur Instrument 1" },
          average_humidity_tower: { '$avg': "$Relative Luftfeuchtigkeit Turm" },
          average_dew_point_tower: { '$avg': "$Taupunkt Turm" },
          average_foehn_index: { '$avg': "$Föhnindex" }
        }
      },
      { '$sort': { '_id': 1 } }
    ];
    const coll = client.db('BA').collection('WeatherData');
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();   

    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

router.get('/getData', (req, res) => {
  const { type, location, dateFrom, dateTill } = req.query;
  getWeatherData(type, location, dateFrom, dateTill).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  }).catch(error => {
    res.status(500).send('Error fetching data');
  });
});

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
});$

module.exports = router;