'use strict';

global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const options = {
  connection: {
    host: "localhost",
    port: 3000
  },
  swagger: {
    title: "myAppTest",
    description: "Test app for the api_base_js",
    version: "1.0.0",
    swaggerDoc : './swaggerDoc.json'
  },
  controllers : './handlers',
  middleware : './middlewares',
  models: 'models/',
  endpoints : './endpoints.js'
};

const api_base = require('api_base_js')(app, options);

//utilities
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let endpoints = require('./endpoints.js');

app.listen(options.connection.port, console.log('listening on port 3000'));

