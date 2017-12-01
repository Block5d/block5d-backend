var toValidate = require("validate.js");
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
    //logger.debug("validation ....");
    //logger.debug(req.originalUrl);
    var model = HttpUtil.getModelPath(req.originalUrl);
    //logger.debug(model);
    var httpMethod = req.method;
    var reqObj = req.body;
    
    if(httpMethod == 'POST' || httpMethod == 'PUT' || httpMethod == 'PATCH'){
        try{
            let constraints = require('./' + model + "-validation");
            logger.debug(constraints);

            let errors = toValidate(reqObj, constraints);
            console.log(errors);
            if(!errors){
                res.status(500).json(error);
            }
            next();
        }catch(err){
            console.log(err);
            res.status(500).json({error: err, message: "trying to post/put/patch unsupported model"});
        }
    }else{
        logger.debug("Likely is GET !");
        next();
    }
}

module.exports = validate;