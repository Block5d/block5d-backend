'use strict';
const domain_name = "http://localhost:3001";
module.exports = {
    domain_name: domain_name,
    authentication_enable: true,
    mongodb: process.env.MONGODB_URL || "mongodb://nusiss:password1234@ds029456.mlab.com:29456/judgeformdb",
    sqldb: process.env.SQLDB_URL,
    port: process.env.PORT,
}