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
      },{ '$sort': { '_id': 1 } }
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
    },{ '$sort': { '_id': 1 } }
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
          Temperatur: { '$avg': "$Temperatur" },
          Taupunkt: { '$avg': "$Taupunkt" },
          Wetterbedingung: { $avg: "$Wetterbedingung" },
          Windrichtung: { '$avg': "$Windrichtung" },
          Luftfeuchtigkeit: { '$avg': "$Luftfeuchtigkeit" },
          'Niederschlagsmenge (letzte Stunde)': { '$avg': "$Niederschlagsmenge (letzte Stunde)" },
          'Schneefallmenge (letzte Stunde)': { '$avg': "$Schneefallmenge (letzte Stunde)" },
          "Windgeschwindigkeit in km/h": { '$avg': "$Windgeschwindigkeit" },
          Windböen: { '$avg': "$Windböen" },
          Luftdruck: { '$avg': "$Luftdruck" },
          Sonneneinstrahlungsdauer: { '$avg': "$Sonneneinstrahlungsdauer" },
          Globalstrahlung: { '$avg': "$Globalstrahlung" },
          'Luftdruck reduziert auf Meeresniveau': { '$avg': "$Luftdruck reduziert auf Meeresniveau" },
          'Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre': { '$avg': "$Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre" },
          'Geopotentielle Höhe der 850 hPa-Fläche': { '$avg': "$Geopotentielle Höhe der 850 hPa-Fläche" },
          'Geopotentielle Höhe der 700 hPa-Fläche': { '$avg': "$Geopotentielle Höhe der 700 hPa-Fläche" },
          'Windrichtung vektoriell': { '$avg': "$Windrichtung vektoriell" },
          'Windgeschwindigkeit Turm in km/h': { '$avg': "$Windgeschwindigkeit Turm" },
          'Böenspitze Turm': { '$avg': "$Böenspitze Turm" },
          'Lufttemperatur Instrument 1': { '$avg': "$Lufttemperatur Instrument 1" },
          'Relative Luftfeuchtigkeit Turm': { '$avg': "$Relative Luftfeuchtigkeit Turm" },
          'Taupunkt Turm': { '$avg': "$Taupunkt Turm" },
          Föhnindex: { '$avg': "$Föhnindex" },
          Koordinaten: { '$first': '$Koordinaten' },
          Land: { '$first': '$Land' }
        }
      },
      {
        $project: {
          _id: 1,
          Temperatur: 1,
          Taupunkt: 1,
          Wetterbedingung: 1,
          Windrichtung: 1,
          Luftfeuchtigkeit: 1,
          'Niederschlagsmenge (letzte Stunde)': 1,
          'Schneefallmenge (letzte Stunde)': 1,
          "Windgeschwindigkeit in km/h": 1,
          Windböen: 1,
          Luftdruck: 1,
          Sonneneinstrahlungsdauer: 1,
          Globalstrahlung: 1,
          'Luftdruck reduziert auf Meeresniveau': 1,
          'Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre': 1,
          'Geopotentielle Höhe der 850 hPa-Fläche': 1,
          'Geopotentielle Höhe der 700 hPa-Fläche': 1,
          'Windrichtung vektoriell': 1,
          'Windgeschwindigkeit Turm in km/h': 1,
          'Böenspitze Turm': 1,
          'Lufttemperatur Instrument 1': 1,
          'Relative Luftfeuchtigkeit Turm': 1,
          'Taupunkt Turm': 1,
          Föhnindex: 1,
          Koordinaten: 1,
          Land: 1,
          "Windgeschwindigkeit in m/s": {
            $divide: [{ $avg: "$Windgeschwindigkeit" }, 3.6]
          },
          "Windgeschwindigkeit Turm in m/s":{
            $divide: [{ $avg: "$Windgeschwindigkeit Turm" }, 3.6]
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
});

module.exports = router;
