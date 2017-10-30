'use strict';
const domain_name = "http://localhost:3000";
module.exports = {
    domain_name: domain_name,
    authentication_enable: false,
    mongodb: process.env.MONGODB_URL || "mongodb://nusiss:password1234@ds029456.mlab.com:29456/judgeformdb",
    sqldb: process.env.SQLDB_URL || "mysql://root:password1234@localhost/yummylicious?reconnect=true",
    sql_seed: false,
    port: process.env.PORT,
}