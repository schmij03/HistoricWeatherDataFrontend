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
      {
        '$group': {
          '_id': "$Zeit",
          Temperatur: { '$avg': { $toDouble: "$Temperatur" } },
          Taupunkt: { '$avg': { $toDouble: "$Taupunkt" } },
          Wetterbedingung: { '$avg': { $toDouble: "$Wetterbedingung" } },
          Windrichtung: { '$avg': { $toDouble: "$Windrichtung" } },
          Luftfeuchtigkeit: { '$avg': { $toDouble: "$Luftfeuchtigkeit" } },
          'Niederschlagsmenge (letzte Stunde)': { '$avg': { $toDouble: "$Niederschlagsmenge (letzte Stunde)" } },
          'Schneefallmenge (letzte Stunde)': { '$avg': { $toDouble: "$Schneefallmenge (letzte Stunde)" } },
          "Windgeschwindigkeit in km/h": { '$avg': { $toDouble: "$Windgeschwindigkeit in km/h" } },
          Windböen: { '$avg': { $toDouble: "$Windböen" } },
          Luftdruck: { '$avg': { $toDouble: "$Luftdruck" } },
          Sonneneinstrahlungsdauer: { '$avg': { $toDouble: "$Sonneneinstrahlungsdauer" } },
          Globalstrahlung: { '$avg': { $toDouble: "$Globalstrahlung" } },
          'Luftdruck reduziert auf Meeresniveau': { '$avg': { $toDouble: "$Luftdruck reduziert auf Meeresniveau" } },
          'Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre': { '$avg': { $toDouble: "$Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre" } },
          'Geopotentielle Höhe der 850 hPa-Fläche': { '$avg': { $toDouble: "$Geopotentielle Höhe der 850 hPa-Fläche" } },
          'Geopotentielle Höhe der 700 hPa-Fläche': { '$avg': { $toDouble: "$Geopotentielle Höhe der 700 hPa-Fläche" } },
          'Windrichtung vektoriell': { '$avg': { $toDouble: "$Windrichtung vektoriell" } },
          'Windgeschwindigkeit Turm in km/h': { '$avg': { $toDouble: "$Windgeschwindigkeit Turm in km/h" } },
          'Böenspitze Turm': { '$avg': { $toDouble: "$Böenspitze Turm" } },
          'Lufttemperatur Instrument 1': { '$avg': { $toDouble: "$Lufttemperatur Instrument 1" } },
          'Relative Luftfeuchtigkeit Turm': { '$avg': { $toDouble: "$Relative Luftfeuchtigkeit Turm" } },
          'Taupunkt Turm': { '$avg': { $toDouble: "$Taupunkt Turm" } },
          Föhnindex: { '$avg': { $toDouble: "$Föhnindex" } },
          Koordinaten: { '$first': '$Koordinaten' },
          Land: { '$first': '$Land' }
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
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
  });
});


//get all Stations grouped (Ort)
router.get('/getStations', (req, res) => {
getStations().then(function(result) {    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

module.exports = router;
