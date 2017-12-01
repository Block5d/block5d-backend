/**
 * Debug logger utility
 * @author Kenneth Phanf
 */
'use strict';
const debugenv = (process.env.APP_DEBUG === 'true');
var bunyan = require('bunyan');
let bunyanlogger = bunyan.createLogger({
    name: 'block5d-backend',
    streams: [
        {
            level: 'debug',
            stream: process.stdout,
        },
        {
            level: 'error',
            path: process.env.ERROR_LOG || "./logs/app-error.log"
        }
    ]
});
function error() {
    if (!debugenv) return;

    bunyanlogger.error(...arguments);
}

function info() {
    if (!debugenv) return;

    bunyanlogger.info(...arguments);
}

function debug() {
    if (!debugenv) return;

    bunyanlogger.debug(...arguments);
}

module.exports = {
    error, info, debug
};