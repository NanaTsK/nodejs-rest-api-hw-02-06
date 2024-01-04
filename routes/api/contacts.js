const express = require("express");
const ctrl = require("../../controllers/contacts");
const router = express.Router();
const {
	emptyBody,
	validateBody,
	isValidID,
	authenticate,
} = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidID, ctrl.getContactById);

router.post(
	"/",
	emptyBody(),
	authenticate,
	validateBody(schemas.addSchema),
	ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidID, ctrl.removeContact);

router.put(
	"/:contactId",
	authenticate,
	isValidID,
	emptyBody(),
	validateBody(schemas.addSchema),
	ctrl.updateContact
);

router.patch(
	"/:contactId/favorite",
	authenticate,
	isValidID,
	emptyBody("missing field favorite"),
	validateBody(schemas.updateSchema),
	ctrl.updateStatusContact
);

module.exports = router;
