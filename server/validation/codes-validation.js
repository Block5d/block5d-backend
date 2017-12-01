var Legalize = require("legalize");

var schema = {
    /*
    firstName:
        Legalize.string().minLength(1).maxLength(30).required(),
    lastName:
        Legalize.string().minLength(1).maxLength(30).required(),
    age:
        Legalize.number().integer().min(18),
    sex:
        Legalize.string().sanitizeBefore(function (value) {
        		value.toLowerCase();
        }).valid("male", "female").optional(),*/
};

exports.schema = schema;