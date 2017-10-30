var Sequelize = require('sequelize');
var config = require("./config");

console.log(config.sqldb);
var database = new Sequelize(config.sqldb, {
    pool: {
        max: 20,
        min: 0,
        idle: 10000
    }
});

database
    .sync({force: config.sql_seed})
    .then(function () {
        console.log("Database in Sync Now");
        require("./api/sql/seed")();
    });

module.exports = {
    database: database
};
