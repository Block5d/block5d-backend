'use strict';
const domain_name = process.env.DOMAIN_NAME;
module.exports = {
    domain_name: domain_name,
    authentication_enable: true,
    mongodb: process.env.MONGODB_URL,
    sqldb: process.env.SQLDB_URL,
    database: process.env.SQL_DBNAME,
    sql_seed: process.env.SEED_FLAG,
    port: process.env.PORT
}