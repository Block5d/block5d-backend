"use strict";
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var cors = require("cors");
var helmet = require("helmet");
var session = require('express-session');
const csurf = require("csurf");
var logger = require("./util/logger");
var config = require("./config");
const routes = require("./routes");
var swaggerJSDoc = require('swagger-jsdoc');

var swaggerDefinition = {
    info: { // API informations (required)
        title: 'Block5D API', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'Block5D Progressive Payment Web App API', // Description (optional)
    },
    basePath: '/', // Base path (optional)
};

var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./routes*.js', './parameters.yaml'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);


var app = express();

app.use(compression());
app.use(helmet());

app.disable('x-power-by');
app.use(cors({optionSuccessStatus: 200}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
//app.use(csurf({ cookie : true}));

var sess = {
    secret: 'zaqwsxcde%T1',
    cookie: {}
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

routes.init(app);
routes.errorHandler(app);

app.use(function(err, req, res, next){
    if(err.code !== 'EBADCSRFTOKEN') return next(err);
    logger.debug("app use");
    res.status(403);
    res.send('ERROR CSURF !');
});

module.exports = app;