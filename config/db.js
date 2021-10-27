const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// load config
dotenv.config({ path: './config/config.env' });

const DB_URL = process.env.NODE_ENV === 'development' || 'test'
  ? process.env.DB_DEV_URI
  : process.env.DB_LIVE_URI;

const client = new MongoClient(DB_URL);
// //connect to Mongo
exports.connectDB = async () => {
  try {
    await client.connect();

    console.log('mongoDB Connected');
  } finally {
    // await client.close()
  }
};

exports.db = client.db();
