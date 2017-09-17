"use strict";
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');

var app = express();

app.disable('x-power-by');
app.use(cors({optionSuccessStatus: 200}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;
var server = app.listen(port, function(){
    console.log("Server listening on port " + port);
});

module.exports = app;