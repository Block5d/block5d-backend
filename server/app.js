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
const routes = require("./routes");

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

routes.init(app);
routes.errorHandler(app);

app.use(function(err, req, res, next){
    if(err.code !== 'EBADCSRFTOKEN') return next(err);
    logger.debug("app use");
    res.status(403);
    res.send('ERROR CSURF !');
});

module.exports = app;