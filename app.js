const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();
const errorHandler = require('./utils/error-handler');
const dotenv = require('dotenv');

//load config
dotenv.config({path: './config/config.env'});

//passport config
require('./config/passport')(passport);

//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }))

//Express session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect cookieParser
app.use(cookieParser());  

//Routes and other middlewares
app.use('/api/v1/', require('./routes/agents'));
// app.use('/users', require('./routes/postListing'));

// global error handler
app.use(errorHandler);

module.exports = app;
