var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var config = require("./config");

var PROD_URI = config.mongodb;
console.log(PROD_URI);
var databases = {
  production: async.apply(MongoClient.connect, PROD_URI),
};
 
module.exports = function (cb) {
  async.parallel(databases, cb);
};