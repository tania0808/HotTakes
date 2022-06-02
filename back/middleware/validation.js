// VAlIDATION
const Joi = require('@hapi/joi');
const passwordValidator = require('password-validator');

// Create a schema

const passwordValidation = data => {

    const schema = new passwordValidator();
    
    // Add properties to it
    schema
    .is().min(6)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    
    return schema.validate(data);
}


// REGISTER VALIDATION
const loginValidation = data => {
    const schema = Joi.object ({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    
    return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.passwordValidation = passwordValidation;