'use strict';

var ENV = process.env.NODE_ENV || "development";
console.log(ENV);
if(ENV !='test'){
    module.exports = require('./' + ENV + '.js') || {};
}
