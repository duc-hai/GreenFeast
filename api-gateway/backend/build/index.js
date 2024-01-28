"use strict";

var express = require('express');
var env = require('dotenv');
var app = express();
var database = require('./database/connectMongo');
var routes = require('./routes');
var cookieParser = require('cookie-parser');
env.config();
database.connect();
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(express.json({
  limit: '50mb'
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 3000;
app.use('/', routes);
app.listen(PORT, HOST, function () {
  console.log("API Gateway is running at http://".concat(HOST, ":").concat(PORT));
});