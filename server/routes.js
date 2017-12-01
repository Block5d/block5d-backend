/**
 * Routes
 * @author Kenneth Phang
 */
var path = require("path");
var express = require('express');
var isAuthenticated = require("./authentication");
var Validator = require("./validation/validator");

const API_V1_ROOT = "/api/v1/";

const API_ROOT_MONGODB = "mongodb/";
const CLIENT_FOLDER = path.join(__dirname + '/../public');


const API_MONGODB_URI_GP = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName`; // GET and POST
const API_MONGODB_URI_GP2 = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/:id`; // GET and PUT and DELETE
const API_MONGODB_URI_COUNT = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/count`; // COUNT
const API_MONGODB_URI_SEARCH = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/search`; // search with criteria
const API_MONGODB_URI_EXIST = `${API_V1_ROOT}${API_ROOT_MONGODB}:collectionName/exists/:id`; // exists
const API_MONGODB_URI_PARENT_CHILD = `${API_V1_ROOT}${API_ROOT_MONGODB}:parentCollection/:id/:childCollection/:child_field_name`; // parent and child relationship

module.exports = {
    init: configureRoutes,
    errorHandler: errorHandler    
};

function configureRoutes(app, dbs){

    /*
    mongodb
    GET         /api/v1/mongodb/:collectionName
    POST        /api/v1/mongodb/:collectionName
    GET         /api/v1/mongodb/:collectionName/:id
    PUT         /api/v1/mongodb/:collectionName/:id
    DELETE         /api/v1/mongodb/:collectionName/:id
    GET         /api/v1/mongodb/:collectionName/count
    GET         /api/v1/mongodb/:collectionName/search
    GET         /api/v1/mongodb/:collectionName/exists/:id
    GET         /api/v1/mongodb/:parentCollection/:id/:childCollection/:child_field_name
    */

    // find all
    app.get(API_MONGODB_URI_GP, isAuthenticated, Validator, (req,res)=>{
        logger.debug("get All");
        let model = HttpUtil.getModelPath(req.originalUrl);
        logger.debug(model);

        //if(typeof req.session.firebaseAuthUserid !== 'undefined')
        //    logger.debug(req.session.firebaseAuthUserid);
        let projection = req.body;

        let dbModel = dbs.instance.collection(model);
        dbModel.find({}, projection).toArray(function (err, result) {
            if(err)
                handleErr(res,err);
            returnResults(result,res);
        });
    });

    // save record
    app.post(API_MONGODB_URI_GP, isAuthenticated, Validator, (req,res)=> {
        logger.debug("insert one");
        let model = HttpUtil.getModelPath(req.originalUrl);
        let insertBody = req.body;
        let query = insertBody.query;

        let dbModel = dbs.instance.collection(model);
        dbModel.count(query, function (err, result) {
            if (result > 0){
                handleErr(res, new Error('Record already exist.'));
            }else {
                delete insertBody.query;
                dbModel.insertOne(insertBody, function (err, result) {
                    if (err)
                        handleErr(res, err);
                    returnResults(result, res);
                });
            }
        });
    });

    // get single record
    app.get(API_MONGODB_URI_GP2, isAuthenticated, Validator, (req,res)=>{
        logger.debug("insert one");
        let model = HttpUtil.getModelPath(req.originalUrl);
        let recordId = req.query.id;
        let query = { _id: recordId};
        let dbModel = dbs.instance.collection(model);
        dbModel.findOne(query, function (err, result) {
            if (err)
                handleErr(res, err);
            returnResults(result, res);
        });
    });

    // update record
    app.put(API_MONGODB_URI_GP2, isAuthenticated, Validator, (req,res)=>{
        // Modify and return the modified document
        let model = HttpUtil.getModelPath(req.originalUrl);
        let updateBody = req.body;
        let recordId = req.query.id;
        let query = { _id: recordId};
        let dbModel = dbs.instance.collection(model);
        dbModel.findOneAndUpdate(query, {$set: updateBody}, {
            returnOriginal: false
            , sort: [[a,1]]
            , upsert: true
        }, function(err, result) {
            if (err)
                handleErr(res, err);
            returnResults(result, res);
        });
    });

    app.delete(API_MONGODB_URI_GP2, isAuthenticated, Validator, (req,res)=>{
        // Remove and return a document
        let model = HttpUtil.getModelPath(req.originalUrl);
        let recordId = req.query.id;
        let query = { _id: recordId};
        let dbModel = dbs.instance.collection(model);
        dbModel.findOneAndDelete(query, function(err, result) {
            if (err)
                handleErr(res, err);
            returnResults(result, res);
        });
    });

    app.get(API_MONGODB_URI_COUNT, isAuthenticated, Validator, (req,res)=>{
        let model = HttpUtil.getModelPath(req.originalUrl);
        let dbModel = dbs.instance.collection(model);
        dbModel.count({}, function (err, result) {
            if (err)
                handleErr(res, err);
            returnResults(result, res);
        });
    });

    app.get(API_MONGODB_URI_SEARCH, isAuthenticated, Validator, (req,res)=>{
        logger.debug("search by criteria");
        let model = HttpUtil.getModelPath(req.originalUrl);
        let searchCriteria = req.body.criteria;
        let projection = req.body.projection;

        logger.debug(searchCriteria);
        let dbModel = dbs.instance.collection(model);
        dbModel.find(searchCriteria).project(projection).toArray(function (err, result) {
            if(err)
                handleErr(res,err);
            returnResults(result,res);
        });
    });

    // check if record exist
    app.get(API_MONGODB_URI_EXIST, isAuthenticated, Validator, (req,res)=>{
        let recordId = req.query.id;
        let query = { _id: recordId};
        let model = HttpUtil.getModelPath(req.originalUrl);
        let dbModel = dbs.instance.collection(model);
        dbModel.count(query, function (err, result) {
            if (err)
                handleErr(res, err);
            returnResults(result, res);
        });

    });

    app.get(API_MONGODB_URI_PARENT_CHILD, isAuthenticated, Validator, (req,res)=>{

    });

    app.use(express.static(CLIENT_FOLDER));

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