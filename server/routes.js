/**
 * Routes
 * @author Kenneth Phang
 */
var path = require("path");
var express = require('express');
var mongo = require('mongodb');
var isAuthenticated = require("./authentication");
var Validator = require("./validation/validator");
var MongoDatabase = require('./mongohelper');
const logger = require('./util/logger');
const HttpUtil = require('./util/HttpUtil');

const API_V1_ROOT = "/api/v1/";

const API_ROOT_MONGODB = "mongodb/";
const CLIENT_FOLDER = path.join(__dirname + '/../public');


const API_MONGODB_URI_GP = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName`; // GET and POST
const API_MONGODB_URI_GP2 = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/:id`; // GET and PUT and DELETE
const API_MONGODB_URI_EXIST = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/exists/:id`; // exists
const API_MONGODB_URI_SEARCH = `${API_V1_ROOT}search`; // search with criteria

module.exports = {
    init: configureRoutes,
    errorHandler: errorHandler    
};

function configureRoutes(app){

    /**
     * @swagger
     * /api/v1/mongodb/collections:
     *   get:
     *     description: Get All collections record
     *     tags: [Result]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Result
     */
    app.get(API_MONGODB_URI_GP, isAuthenticated, Validator, function(req,res){
        logger.debug("get All");

        MongoDatabase(function(err, dbs){
            if(err)
                logger.error(err);
            let model = HttpUtil.getModelPath(req.originalUrl);
            logger.debug(model);

            let projection = req.body;

            let dbModel = dbs.instance.collection(model);
            dbModel.find({}, projection).toArray(function (err, result) {
                if(err)
                    handleErr(res,err);
                returnResults(result,res);
            });
        });
    });

    /**
     * @swagger
     * /api/v1/mongodb/collections:
     *   post:
     *     description: Insert one record
     *     tags: [Result]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Result
     */
    app.post(API_MONGODB_URI_GP, isAuthenticated, Validator, function(req, res) {
        logger.debug(" .... insert one....");
        MongoDatabase(function(err, dbs) {
            let model = HttpUtil.getModelPath(req.originalUrl);
            var insertBody = req.body;
            var queryObj = {};
            // terrible hack !
            JSON.parse(JSON.stringify(insertBody.query), (key, value) => {
                JSON.parse(value, (key2, value2) => {
                    if(key2)
                        queryObj[key2] = value2;
                })
            });
            let dbModel = dbs.instance.collection(model);
            logger.debug(queryObj);
            logger.debug(typeof queryObj);
            dbModel.find(queryObj).count( function (err, result) {
                console.log(result);
                if (parseInt(result) > 0) {
                    handleErr(res, {error_message: "Record already exist"});
                } else {
                    delete insertBody.query;
                    dbModel.insertOne(insertBody, function (err, result) {
                        if (err)
                            handleErr(res, err);
                        returnResults(result, res);
                    });
                }
            });
        });
    });

    /**
     * @swagger
     * /api/v1/mongodb/collections/:id:
     *   get:
     *     description: Get one record
     *     tags: [Result]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Result
     */
    app.get(API_MONGODB_URI_GP2, isAuthenticated, Validator, function(req,res){
        logger.debug("Get One record");
        let model = HttpUtil.getModelPath(req.originalUrl);
        let recordId = req.params.id;
        logger.debug(recordId);
        let o_id = new mongo.ObjectID(recordId);
        let query = { "_id": o_id};
        MongoDatabase(function(err, dbs) {
            let dbModel = dbs.instance.collection(model);
            console.log(query);
            dbModel.findOne(query, function (err, result) {
                if (err)
                    handleErr(res, err);
                console.log(result);
                returnResults(result, res);
            });
        });
    });

    /**
     * @swagger
     * /api/v1/mongodb/collections/:id:
     *   put:
     *     description: Update record
     *     tags: [Result]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Result
     */
    app.put(API_MONGODB_URI_GP2, isAuthenticated, Validator, function(req,res){
        logger.debug("Update One record");
        // Modify and return the modified document
        let model = HttpUtil.getModelPath(req.originalUrl);
        let updateBody = req.body;
        let recordId = req.params.id;
        let o_id = new mongo.ObjectID(recordId);
        let query = { "_id": o_id};
        MongoDatabase(function(err, dbs) {
            let dbModel = dbs.instance.collection(model);
            dbModel.findOneAndUpdate(query, {$set: updateBody}, {
                returnOriginal: false
                , upsert: true
            }, function (err, result) {
                if (err)
                    handleErr(res, err);
                returnResults(result, res);
            });
        });
    });

    /**
     * @swagger
     * /api/v1/mongodb/collections/:id:
     *   delete:
     *     description: Delete record from collections
     *     tags: [Result]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Result
     */
    app.delete(API_MONGODB_URI_GP2, isAuthenticated, Validator, function(req,res){
        logger.debug("Delete One record");
        // Remove and return a document
        let model = HttpUtil.getModelPath(req.originalUrl);
        let recordId = req.params.id;
        let o_id = new mongo.ObjectID(recordId);
        let query = { "_id": o_id};
        MongoDatabase(function(err, dbs) {
            let dbModel = dbs.instance.collection(model);
            dbModel.findOneAndDelete(query, function (err, result) {
                if (err)
                    handleErr(res, err);
                returnResults(result, res);
            });
        });
    });

    app.get(API_MONGODB_URI_SEARCH, isAuthenticated, Validator, function(req,res){
        logger.debug("search by criteria");
        let model = req.query.collectionName;
        let searchCriteria = req.body.criteria;
        let projection = req.body.projection;

        logger.debug(searchCriteria);
        MongoDatabase(function(err, dbs) {
            let dbModel = dbs.instance.collection(model);
            dbModel.find(searchCriteria).project(projection).toArray(function (err, result) {
                if (err)
                    handleErr(res, err);
                returnResults(result, res);
            });
        });
    });

    // check if record exist
    app.get(API_MONGODB_URI_EXIST, isAuthenticated, Validator, function(req,res){
        let model = HttpUtil.getModelPath(req.originalUrl);
        let recordId = req.params.id;
        let o_id = new mongo.ObjectID(recordId);
        let query = { "_id": o_id};
        MongoDatabase(function(err, dbs) {
            let dbModel = dbs.instance.collection(model);
            dbModel.count(query, function (err, result) {
                if (err)
                    handleErr(res, err);
                returnResults(result, res);
            });
        });
    });

    app.use(express.static(CLIENT_FOLDER));

    function handleErr (res, err){
        console.log('handleErr');
        res.status(500).json(err);
    }

    function returnResults(results, res) {
        res.status(200).json(results);
    }
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