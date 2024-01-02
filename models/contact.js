const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
			required: [true, "Set email for contact"],
		},
		phone: {
			type: String,
			required: [true, "Set phone for contact"],
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{ versionKey: false, timestamps: true }
);
const addSchema = Joi.object({
	name: Joi.string()
		.required()
		.messages({ "any.required": "missing required name field" }),
	email: Joi.string()
		.email()
		.required()
		.messages({ "any.required": "missing required email field" }),
	phone: Joi.string()
		.required()
		.messages({ "any.required": "missing required phone field" }),
	favorite: Joi.boolean().required(),
});
const updateSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const schemas = {
	addSchema,
	updateSchema,
};

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

module.exports = {
	Contact,
	schemas,
};
