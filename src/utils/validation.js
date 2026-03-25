const validator = require('validator');

const validateSignupRequest = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName || !emailId || !password){
        throw new Error("Missing required fields: firstName, lastName, emailId, and password are required.");
    }
    if(validator.isEmail(emailId) === false){
        throw new Error("Invalid email format.");
    }

    if(validator.isStrongPassword(password) === false){
        throw new Error("Weak password. Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.");
    }

}

module.exports = {
    validateSignupRequest
}