'use strict';

global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const options = {
  swaggerDoc : './swaggerDoc.json',
  controllers : './handlers',
  middleware : './middlewares',
  endpoints : './ednpoints.js'
};

const api_base = require('api_base_js')(app, options);

//utilities
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let endpoints = require('./endpoints.js');

//api_base.exposeToApigateway(endpoints);

app.listen(3000, console.log('listening on port 3000'));

