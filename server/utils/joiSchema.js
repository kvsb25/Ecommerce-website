const Joi = require('joi');

module.exports.signUpSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().pattern(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    phone: Joi.string().length(10),
    role: Joi.string().required()
})

module.exports.logInSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})