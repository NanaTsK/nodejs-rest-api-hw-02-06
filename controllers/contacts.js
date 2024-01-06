const { Contact } = require("../models/contact");
const { ctrlWrapper, HttpError } = require("../helpers");

// const listContacts = async (req, res, next) => {
// 	const { page = 1, limit = 20, favorite = null } = req.query;
// 	const skip = (page - 1) * limit;

// 	if (favorite) {
// 		const result = await Contact.find(
// 			{ owner: req.user._id, favorite },
// 			"-createdAt -updatedAt -owner -_id",
// 			{ skip, limit }
// 		);
// 		res.json(result);
// 		return;
// 	}

// 	const result = await Contact.find(
// 		{ owner: req.user._id },
// 		"-createdAt -updatedAt -owner -_id",
// 		{ skip, limit }
// 	);
// 	res.json(result);
// };

const listContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;
	const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
		skip,
		limit,
	}).populate("owner", "name email");
	res.status(200).json(result);
};

// const getContactById = async (req, res, next) => {
// 	const { contactId } = req.params;
// 	const contact = await Contact.findById(contactId);
// 	if (!contact) {
// 		throw HttpError(404, "Not found");
// 	}
// 	res.status(200).json(contact);
// };
const getContactById = async (req, res) => {
	const { contactId } = req.params;
	const contactByID = await Contact.findById(contactId);
	if (!contactByID) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json(contactByID);
};

const addContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
	const { contactId } = req.params;
	const removedContact = await Contact.findByIdAndDelete(contactId);
	if (!removedContact) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { name, email, phone, favorite } = req.body;
	const updatedContact = await Contact.findByIdAndUpdate(
		contactId,
		{
			name,
			email,
			phone,
			favorite,
		},
		{ new: true }
	);
	if (!updatedContact) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { favorite } = req.body;
	const updatedContact = await Contact.findByIdAndUpdate(
		contactId,
		{
			favorite,
		},
		{ new: true }
	);
	if (!updatedContact) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json(updatedContact);
};

module.exports = {
	listContacts: ctrlWrapper(listContacts),
	getContactById: ctrlWrapper(getContactById),
	addContact: ctrlWrapper(addContact),
	removeContact: ctrlWrapper(removeContact),
	updateContact: ctrlWrapper(updateContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
