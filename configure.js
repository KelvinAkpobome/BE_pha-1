const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const routes = require('./routes/agents');
const errorHandler = require('./utils/error-handler');

// load environment config vars
dotenv.config({ path: './config/config.env' });

// passport config
require('./config/passport')(passport);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); // Bodyparser
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize()); // passport middleware
app.use(passport.session());
app.use(cookieParser()); // connect cookieParser
app.use('/api/v1', routes);
// To catch all unhandled routes
app.get('/api/v1', (req, res, next) => res.status(200).send('Welcome to PHA API'));
app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});
app.use(errorHandler); // global error handler

module.exports = app;
