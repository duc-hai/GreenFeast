const { validationResult } = require('express-validator')

//Check validation inputs
module.exports = checkValidation = (req) => {
    let result = validationResult(req);
    if (result?.errors?.length != 0) {
        result = result.mapped();
        let message;
        for (let i in result) {
            message = result[i].msg;
            break; //Just get first message error
        }
        return message
    }
    return null // No error
};
