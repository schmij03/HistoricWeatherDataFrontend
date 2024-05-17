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
    const result = await cursor.toArray();
    console.log(result);
    return result;
  };



module.exports = getRegions;