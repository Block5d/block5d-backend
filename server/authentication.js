/**
 * Authentication for firebase
 * @author Kenneth Phang
 */
'use strict';
const admin = require.main.require('firebase-admin');

const logger = require('./util/logger');

function firebaseAuthMiddleware(req, res, next) {
    const authorization = req.header('Authorization');
    console.log(` ---> ` + authorization);
    if (authorization) {
        let token = authorization.split(' ');
        admin.auth().verifyIdToken(token[1])
        .then((decodedToken) => {
            logger.debug(decodedToken);
            res.locals.user = decodedToken;
            next();
        })
        .catch(err => {
            logger.debug(err);
            res.sendStatus(401);
        });
    } else {
        logger.debug('Authorization header is not found');
        res.sendStatus(401);
    }
}

module.exports = firebaseAuthMiddleware;