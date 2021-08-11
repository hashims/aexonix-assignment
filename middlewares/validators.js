const Joi = require('joi');


const createUserSchema =  Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'org', 'in'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
    mobile: Joi.string().length(10).pattern(/^[6-9][0-9]{9}$/).required(),
    address: Joi.string().required(),
});

const updateUserSchema =  Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'org', 'in'] } }),
    mobile: Joi.string().length(10).pattern(/^[6-9][0-9]{9}$/).required(),
    address: Joi.string().required(),
});


module.exports = {
    createUserSchema,
    updateUserSchema
}
