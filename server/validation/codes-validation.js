var constraints = {
    "code_details.code": {
        presence: true,
        format: {
            // Must be numbers followed by a name
            pattern: "^[A-Z.\\s_-]+$",
            message: "^The code must be uppercase."
        }
    },
    "category_details.categoryCode": {
        presence: true,
        format: {
            // Must be numbers followed by a name
            pattern: "^[A-Z.\\s_-]+$",
            message: "^The category code must be uppercase."
        }
    }
};

module.exports = constraints;