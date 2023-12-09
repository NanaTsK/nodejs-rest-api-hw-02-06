const Joi = require("joi");

const addSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
});

const putSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string(),
}).or("name", "email", "phone");

module.exports = { addSchema, putSchema };
