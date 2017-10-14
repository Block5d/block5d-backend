var config = require("../../config");
var logger = require("../../util/logger");

exports.get = function (req, res) {
    logger.debug ("get user");
}

exports.register = function(req, res) {
    logger.debug ("register user");
};

exports.list = function (req, res) {
    logger.debug ("list user ...");
    var users = [ { first_name: "", last_name: ""}]
    res.status(200).json(users);
};

exports.resetPassword = function (req, res) {
    logger.debug ("reset password");
};

exports.changePassword = function (req, res) {
    logger.debug ("change password");
};

exports.profile = function (req, res) {
    logger.debug ("profile");
};

exports.profileToken = function (req, res) {
    logger.debug ("profile token");
};


exports.changePasswdToken = function (req, res) {
    logger.debug ("change passoword token");
};

exports.profiles = function (req, res) {
    logger.debug ("profiles");
};

exports.create = function (req, res) {
    logger.debug ("create");
};

exports.update = function (req, res) {
    logger.debug ("update");
};

exports.remove = function (req, res) {
    logger.debug ("remove");
};


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
}

function returnResults(results, res) {
    res.send(results);
}