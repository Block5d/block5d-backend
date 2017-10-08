"use strict";
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var compression = require('compression')
var cors = require("cors");
var helmet = require("helmet");
var csrf = require("csurf");

var app = express();

app.use(compression());
app.use(cors());
app.use(helmet());

app.disable('x-power-by');
app.use(cors({optionSuccessStatus: 200}));
app.use(express.csrf());
app.use(csrf({ cookie : true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;

app.use(function(err, req, res, next){
    if(err.code !== 'EBADCSRFTOKEN') return next(err)

    res.status(403);
    res.send('form tampered with');
});

var server = app.listen(port, function(){
    console.log("Server listening on port " + port);
});

module.exports = app;