"use strict";
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var compression = require('compression')
var cors = require("cors");
var helmet = require("helmet");
var csurf = require("csurf");
var logger = require("./util/logger");

var app = express();

app.use(compression());
app.use(helmet());

app.disable('x-power-by');
app.use(cors({optionSuccessStatus: 200}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser())
app.use(csurf({ cookie : true}));

var port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;

require("./routes")(app);

app.use(function(err, req, res, next){
    if(err.code !== 'EBADCSRFTOKEN') return next(err)
    logger.debug("app use");
    res.status(403);
    res.send('ERROR CSURF !');
});

var server = app.listen(port, ()=>{
    logger.info("Server listening on port " + port);
});

module.exports = app;