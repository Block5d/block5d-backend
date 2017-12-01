var Legalize = require("legalize");
var HttpUtil  = require('../util/HttpUtil');
var logger = require("../util/logger");
/**
 * Middleware custom validator.
 * @author Kenneth Phang
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validate(req, res, next){
    logger.debug("validation ....");
    logger.debug(req.originalUrl);
    var model = HttpUtil.getModelPath(req.originalUrl);
    logger.debug(model);
    var httpMethod = req.method;
    var reqObj = req.body;
    
    if(httpMethod == 'POST' || httpMethod == 'PUT' || httpMethod == 'PATCH'){
        try{
            var modelToCheck = require('./' + model + "-validation");
            logger.debug(modelToCheck);
            logger.debug(reqObj);
            var validationResult = Legalize.validate(reqObj, modelToCheck.schema);
            logger.debug(validationResult);
            if (validationResult.error) {
                // report error here
                logger.debug("validationResult.error" + validationResult.error);
                validationResult.error.forEach(function (error) {
                    // report warning
                    logger.error(error);
                });
                res.status(500).json(validationResult.error);
            } else {
                validationResult.warnings.forEach(function (warning) {
                    // report warning
                    logger.warning(warning);
                });
                res.status(500).json(validationResult.warnings);
                // validationResult.value contains validated value
            }
        }catch(err){
            res.status(500).json({error: err, message: "trying to post/put/patch unsupported model"});
        }
    }else{
        logger.debug("Likely is GET !");
        next();
    }
}

module.exports = validate;