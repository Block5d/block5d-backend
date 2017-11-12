/**
 * Routes
 * @author Kenneth Phang
 */
var path = require("path");
var express = require('express');
var isAuthenticated = require("./authentication");
var Validator = require("./validation/validator");

var SqlController = require("./api/sql/sql.controller");
var MongoDBController = require("./api/mongodb/mongodb.controller");

const API_ROOT = "/api/"
const API_ROOT_SQL = "sql/"
const API_ROOT_MONGODB = "mongo/"
const CLIENT_FOLDER = path.join(__dirname + '/../public');

const API_SQL_URI_GP = `${API_ROOT}${API_ROOT_SQL}:tableName`; // GET and POST
const API_SQL_URI_GP2 = `${API_ROOT}${API_ROOT_SQL}:tableName/:id`; // GET and PUT and DELETE
const API_SQL_URI_COUNT = `${API_ROOT}${API_ROOT_SQL}:tableName/count`; // COUNT
const API_SQL_URI_EXIST = `${API_ROOT}${API_ROOT_SQL}:tableName/exists`; // exists
const API_SQL_URI_PARENT_CHILD = `${API_ROOT}${API_ROOT_SQL}:parentTable/:id/:childTable`; // parent and child relationship
const API_SQL_URI_DYNAMIC = `${API_ROOT}dynamicSql`; // dynamic sql
const API_SQL_URI_DESCRIBE = `${API_ROOT}${API_ROOT_SQL}:tableName/describe`; // dynamic sql
const API_SQL_URI_TABLES = `${API_ROOT}${API_ROOT_SQL}tables`; // list all tables

    
const API_MONGODB_URI_GP = `${API_ROOT}${API_ROOT_MONGODB}:collectionName`; // GET and POST
const API_MONGODB_URI_GP2 = `${API_ROOT}${API_ROOT_MONGODB}:collectionName/:id`; // GET and PUT and DELETE
const API_MONGODB_URI_COUNT = `${API_ROOT}${API_ROOT_MONGODB}:collectionName/count`; // COUNT
const API_MONGODB_URI_EXIST = `${API_ROOT}${API_ROOT_MONGODB}:collectionName/exists`; // exists
const API_MONGODB_URI_PARENT_CHILD = `${API_ROOT}${API_ROOT_MONGODB}:parentCollection/:id/:childCollection`; // parent and child relationship
const API_MONGODB_URI_DYNAMIC = `${API_ROOT}dynamicSql`; // dynamic sql
const API_MONGODB_URI_DESCRIBE = `${API_ROOT}${API_ROOT_MONGODB}:collectionName/describe`; // dynamic sql
const API_MONGODB_URI_TABLES = `${API_ROOT}${API_ROOT_MONGODB}collections`; // list all tables


module.exports = {
    init: configureRoutes,
    errorHandler: errorHandler    
};

function configureRoutes(app){
    /*
    SQL
    GET         /api/sql/:tableName
    POST        /api/sql/:tableName
    GET         /api/sql/:tableName/:id
    PUT         /api/sql/:tableName/:id
    GET         /api/sql/:tableName/count
    GET         /api/sql/:tableName/exists
    GET         /api/sql/:parentTable/:id/:childTable
    DELETE      /api/sql/:tableName/:id
    POST        /dynamicSql
    GET         /api/sql/:tableName/describe
    GET         /api/sql/tables
    */
    app.get(API_SQL_URI_GP, isAuthenticated, Validator, SqlController.getAll);
    app.post(API_SQL_URI_GP, isAuthenticated, Validator, SqlController.create);
    app.get(API_SQL_URI_GP2, isAuthenticated, Validator, SqlController.getOne);
    app.put(API_SQL_URI_GP2, isAuthenticated, Validator, SqlController.update);
    app.get(API_SQL_URI_COUNT, isAuthenticated, Validator, SqlController.count);
    app.get(API_SQL_URI_EXIST, isAuthenticated, Validator, SqlController.isExist);
    app.get(API_SQL_URI_PARENT_CHILD, isAuthenticated, Validator, SqlController.relationship);
    app.post(API_SQL_URI_DYNAMIC, isAuthenticated, Validator, SqlController.dyamicSql);
    app.get(API_SQL_URI_DESCRIBE, isAuthenticated, Validator, SqlController.describe);
    app.get(API_SQL_URI_TABLES, isAuthenticated, Validator, SqlController.tables);
    
    /*
    mongodb
    GET         /api/mongo/:collectionName
    POST        /api/mongo/:collectionName
    GET         /api/mongo/:collectionName/:id
    PUT         /api/mongo/:collectionName/:id
    GET         /api/mongo/:collectionName/count
    GET         /api/mongo/:collectionName/exists
    GET         /api/mongo/:parentCollection/:id/:childCollection
    DELETE      /api/mongo/:collectionName/:id
    POST        /dynamicNoSql
    GET         /api/mongo/:collectionName/describe
    GET         /api/mongo/collections
    */
    app.get(API_MONGODB_URI_GP, isAuthenticated, Validator, MongoDBController.getAll);
    app.post(API_MONGODB_URI_GP, isAuthenticated, Validator, MongoDBController.create);
    app.get(API_MONGODB_URI_GP2, isAuthenticated, Validator, MongoDBController.getOne);
    app.put(API_MONGODB_URI_GP2, isAuthenticated, Validator, MongoDBController.update);
    app.get(API_MONGODB_URI_COUNT, isAuthenticated, Validator, MongoDBController.count);
    app.get(API_MONGODB_URI_EXIST, isAuthenticated, Validator, MongoDBController.isExist);
    app.get(API_MONGODB_URI_PARENT_CHILD, isAuthenticated, Validator, MongoDBController.relationship);
    app.post(API_MONGODB_URI_DYNAMIC, isAuthenticated, Validator, MongoDBController.dyamicNoSql);
    app.get(API_MONGODB_URI_DESCRIBE, isAuthenticated, Validator, MongoDBController.describe);
    app.get(API_MONGODB_URI_TABLES, isAuthenticated, Validator, MongoDBController.tables);
    
    app.use(express.static(CLIENT_FOLDER));
}


function errorHandler(app) {
    app.use(function (req, res) {
        res.status(401).sendFile(CLIENT_FOLDER + "/404.html");
    });

    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).sendFile(path.join(CLIENT_FOLDER + '/500.html'));
    });
};