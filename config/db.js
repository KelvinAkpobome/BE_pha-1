const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load config
dotenv.config({path: './config/config.env'});

const DB_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.DB_DEV_URI
    : process.env.DB_LIVE_URI;
//connect to Mongo  
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB_URL,  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`mongoDB Connected: ${conn.connection.host}`);
    } catch (err) { 
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB