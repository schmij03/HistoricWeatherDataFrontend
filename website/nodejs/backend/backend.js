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

    const agg = [
      {
        $match: {
          [filter]: locationValue,
          'Zeit': {
            '$gte': new Date(fromDate),
            '$lte': new Date(tillDate)
          }
        }
      },  // Filter documents by the specified region or location
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
          average_solar_radiation: { $avg: "$Sonneneinstrahlungsdauer" },  // Average solar radiation
          average_global_radiation: { $avg: "$Globalstrahlung" },  // Average global radiation
          average_pressure_sea_level: { $avg: "$Luftdruck reduziert auf Meeresniveau" },  // Average pressure sea level
          average_pressure_sea_level_standard: { $avg: "$Luftdruck reduziert auf Meeresniveau mit Standardatmosphäre" },  // Average pressure sea level with standard atmosphere
          average_geopotential_height_850hPa: { $avg: "$Geopotentielle Höhe der 850 hPa-Fläche" },  // Average geopotential height 850 hPa
          average_geopotential_height_700hPa: { $avg: "$Geopotentielle Höhe der 700 hPa-Fläche" },  // Average geopotential height 700 hPa
          average_wind_direction_vector: { $avg: "$Windrichtung vektoriell" },  // Average wind direction vector
          average_wind_speed_tower: { $avg: "$Windgeschwindigkeit Turm" },  // Average wind speed tower
          average_wind_gust_tower: { $avg: "$Böenspitze Turm" },  // Average wind gust tower
          average_temperature_instrument1: { $avg: "$Lufttemperatur Instrument 1" },  // Average temperature instrument 1
          average_humidity_tower: { $avg: "$Relative Luftfeuchtigkeit Turm" },  // Average humidity tower
          average_dew_point_tower: { $avg: "$Taupunkt Turm" },  // Average dew point tower
          average_foehn_index: { $avg: "$Föhnindex" }  // Average foehn index
        }
      },
      { $sort: { _id: 1 } }  // Sort by time
    ];    
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
