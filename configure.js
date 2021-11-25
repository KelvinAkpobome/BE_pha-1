const dotenv = require('dotenv');
const express = require('express');
const fullMessage = require('./utils/welcomeMessage');
const { AppError } = require('./utils/response');

const auth = require('./routes/auth');
const listing = require('./routes/listings');
const inspection = require('./routes/inspections');
const admin = require('./routes/admin');
const errorHandler = require('./utils/error-handler');
// const test = message('http')
const app = express();

// load environment config vars
dotenv.config();
// avoiding CORS(Cross Origin Resource Sharing), this adds to the headed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', auth);
app.use('/api/v1', listing);
app.use('/api/v1', admin);
app.use('/api/v1', inspection);
// To catch all unhandled routes
app.get('*', (req, res) => res.status(200).send(fullMessage));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler); // global error handler

module.exports = app;
