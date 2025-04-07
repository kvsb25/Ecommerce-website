const Joi = require('joi');
//.pattern(/^[^<>]*$/)

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

module.exports.productSchema = Joi.object({
    name: Joi.string().pattern(/^[^<>]*$/).required(),
    type: Joi.string().pattern(/^[^<>]*$/).valid('x', 'y', 'z', 'a', 'b', 'c').required(),
    price: Joi.number().min(0).max(999999).required(),
    stock: Joi.number().min(0).required(),
    description: Joi.string().pattern(/^[^<>]*$/).required(),
    details: Joi.object().pattern(/^[^<>]*$/, Joi.string()).required()
})