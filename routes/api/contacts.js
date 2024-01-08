const express = require("express");
const ctrl = require("../../controllers/contacts");
const router = express.Router();
const { validateBody, isValidID, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidID, ctrl.getContactById);

router.post(
	"/",
	authenticate,
	validateBody(schemas.addSchema),
	ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidID, ctrl.removeContact);

router.put(
	"/:contactId",
	authenticate,
	isValidID,
	validateBody(schemas.addSchema),
	ctrl.updateContact
);

router.patch(
	"/:contactId/favorite",
	authenticate,
	isValidID,
	validateBody(schemas.updateSchema),
	ctrl.updateStatusContact
);

module.exports = router;
