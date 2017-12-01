'use strict';
const domain_name = process.env.DOMAIN_NAME;
module.exports = {
    domain_name: domain_name,
    authentication_enable: true,
    mongodb: process.env.MONGODB_URL,
    port: process.env.PORT
}