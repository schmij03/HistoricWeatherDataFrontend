const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://weather:erhwLLotcHI8PTxj@weatherdata.zebph6n.mongodb.net/?retryWrites=true&w=majority&appName=WeatherData";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getRegions() {
  const agg = [{ '$group': { '_id': '$Region' } }];
  const coll = client.db('BA').collection('WeatherData');
  const cursor = coll.aggregate(agg);
  return await cursor.toArray();
}

async function getStations() {
  const agg = [{ '$group': { '_id': '$Ort' } }];
  const coll = client.db('BA').collection('WeatherData');
  const cursor = coll.aggregate(agg);
  return await cursor.toArray();
}

async function getWeatherData(type, locationValue, dateFrom, dateTill) {
  try {
    const fromDate = new Date(dateFrom);
    const tillDate = new Date(dateTill);
    const filter = type == 1 ? 'Region' : 'Ort';

    const matchStage = {
      '$match': { [filter]: locationValue, 'Zeit': { '$gte': fromDate, '$lte': tillDate } }
    };

    const groupStage = {
      $group: {
        _id: "$Zeit",
        average_temperature: { $avg: "$Temperatur" },
        average_dew_point: { $avg: "$Taupunkt" },
        average_weather_condition: { $first: "$Wetterbedingung" },
        average_wind_direction: { $avg: "$Windrichtung" },
        average_humidity: { $avg: "$Luftfeuchtigkeit" },
        average_precipitation: { $avg: "$Niederschlagsmenge (letzte Stunde)" },
        average_snowfall: { $avg: "$Schneefallmenge (letzte Stunde)" },
        average_wind_speed: { $avg: "$Windgeschwindigkeit" },
        average_wind_gust: { $avg: "$Windböen" },
        average_pressure: { $avg: "$Luftdruck" },
        average_solar_radiation: { $avg: "$Sonneneinstrahlungsdauer" },
        average_global_radiation: { $avg: "$Globalstrahlung" },
        average_pressure_sea_level: { $avg: "$Luftdruck reduziert auf Meeresniveau" },
        average_pressure_sea_level_standard: { $avg: "$Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre" },
        average_geopotential_height_850hPa: { $avg: "$Geopotentielle Höhe der 850 hPa-Fläche" },
        average_geopotential_height_700hPa: { $avg: "$Geopotentielle Höhe der 700 hPa-Fläche" },
        average_wind_direction_vector: { $avg: "$Windrichtung vektoriell" },
        average_wind_speed_tower: { $avg: "$Windgeschwindigkeit Turm" },
        average_wind_gust_tower: { $avg: "$Böenspitze Turm" },
        average_temperature_instrument1: { $avg: "$Lufttemperatur Instrument 1" },
        average_humidity_tower: { $avg: "$Relative Luftfeuchtigkeit Turm" },
        average_dew_point_tower: { $avg: "$Taupunkt Turm" },
        average_foehn_index: { $avg: "$Föhnindex" }
      }
    };

    const sortStage = { $sort: { _id: 1 } };
    const agg = [matchStage, groupStage, sortStage];
    const coll = client.db('BA').collection('WeatherData');
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();

    console.log('Weather data result:', result);

    const columns = [
      "Zeit",
      "average_temperature",
      "average_dew_point",
      "average_weather_condition",
      "average_wind_direction",
      "average_humidity",
      "average_precipitation",
      "average_snowfall",
      "average_wind_speed",
      "average_wind_gust",
      "average_pressure",
      "average_solar_radiation",
      "average_global_radiation",
      "average_pressure_sea_level",
      "average_pressure_sea_level_standard",
      "average_geopotential_height_850hPa",
      "average_geopotential_height_700hPa",
      "average_wind_direction_vector",
      "average_wind_speed_tower",
      "average_wind_gust_tower",
      "average_temperature_instrument1",
      "average_humidity_tower",
      "average_dew_point_tower",
      "average_foehn_index"
    ];

    return { columns: columns, data: result };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

router.get('/getRegions', (req, res) => {
  getRegions().then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

router.get('/getStations', (req, res) => {
  getStations().then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

router.get('/getRegionData', (req, res) => {
  const { region, dateFrom, dateTill } = req.query;
  getWeatherData(1, region, dateFrom, dateTill).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

router.get('/getStationsData', (req, res) => {
  const { ort, dateFrom, dateTill } = req.query;
  getWeatherData(2, ort, dateFrom, dateTill).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

module.exports = router;
