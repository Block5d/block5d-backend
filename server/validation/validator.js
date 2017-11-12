var Legalize = require("legalize");

/**
 * Middleware custom validator.
 * @author Kenneth Phang
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validate(req, res, next){
    console.log("validation ....");
    console.log(req.originalUrl);
    var values = req.originalUrl.split("/");
    console.log(values[3]);
    var model = values[3];
    var httpMethod = req.method;
    var reqObj = req.body;
    
    if(httpMethod == 'POST' || httpMethod == 'PUT' || httpMethod == 'PATCH'){
        try{
            var modelToCheck = require('./' + model + "-validation");
            console.log(modelToCheck);
            console.log(reqObj);
            var validationResult = Legalize.validate(reqObj, modelToCheck.schema);
            console.log(validationResult);
            if (validationResult.error) {
                // report error here
                console.log("validationResult.error" + validationResult.error);
                validationResult.error.forEach(function (error) {
                    // report warning
                    console.log(error);
                });
                res.status(500).json(validationResult.error);
            } else {
                validationResult.warnings.forEach(function (warning) {
                    // report warning
                    console.log(warning);
                });
                res.status(500).json(validationResult.warnings);
                // validationResult.value contains validated value
            }
        }catch(err){
            res.status(500).json({error: err, message: "trying to push unsupported model"});
        }
    }else{
        next();
    }
}

module.exports = validate;