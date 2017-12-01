var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var config = require("./config");

var MONGODB_URI = config.mongodb;
console.log(MONGODB_URI);
var databases = {
  instance: async.apply(MongoClient.connect, MONGODB_URI),
};
 
module.exports = function (cb) {
  async.parallel(databases, cb);
};