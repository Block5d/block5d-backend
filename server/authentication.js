/**
 * Authentication for firebase
 * @author Kenneth Phang
 */
'use strict';
const admin = require('firebase-admin');

const logger = require('./util/logger');
const config = require('./config');

function firebaseAuthMiddleware(req, res, next) {
    const authorization = req.header('Authorization');
    logger.debug(` ---> ` + authorization);
    logger.debug(` ---> ` + config.authentication_enable);
    var checkAuth = Boolean(config.authentication_enable);
    logger.debug(typeof checkAuth);
    if(checkAuth){
        logger.debug(` ---> ` + config.authentication_enable);
        if (authorization) {
            let token = authorization.split(' ');
            admin.auth().verifyIdToken(token[1])
            .then((decodedToken) => {
                logger.debug(decodedToken);
                req.session.firebaseAuthUserid = admin.firebase.auth().currentUser.uid;
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
    } else {
        logger.debug("Auth turn OFF");
        next();
    }  
}

module.exports = firebaseAuthMiddleware;