var config = require("../../config");
var logger = require("../../util/logger");

var MongoDatabase = require('../../mongohelper');

exports.getAll = function (req, res) {
    logger.debug ("get All");
    var users = [ { first_name: "", last_name: ""}]
    res.status(200).json(users);
}

exports.register = function(req, res) {
    logger.debug ("register model");
};

exports.create = function (req, res) {
    logger.debug ("create ...");
    var users = [ { first_name: "", last_name: ""}]
    res.status(200).json(users);
};

exports.getOne = function (req, res) {
    logger.debug ("reset password");
};

exports.update = function (req, res) {
    logger.debug ("update");
    var users = [ { first_name: "", last_name: ""}]
    res.status(200).json(users);
};

exports.count = function (req, res) {
    logger.debug ("profile token");
};


exports.isExist = function (req, res) {
    logger.debug ("change passoword token");
};

exports.relationship = function (req, res) {
    logger.debug ("profiles");
};

exports.dyamicNoSql = function (req, res) {
    logger.debug ("create");
};

exports.describe = function (req, res) {
    logger.debug ("update");
};

exports.tables = function (req, res) {
    logger.debug ("remove");
};


/*
function handleErr(res) {
    handleErr(res, null);
}


function handleErr(res, err) {
    console.log(err);
    res
        .status(500)
        .json({
            error: true
        });
}

function handler404(res) {
    res
        .status(404)
        .json({message: "User not found!"});
}*/

function returnResults(results, res) {
    res.send(results);
}