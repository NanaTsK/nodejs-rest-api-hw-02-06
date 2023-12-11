const express = require("express");
const ctrl = require("../../controllers/contacts");
const router = express.Router();
const { validateBody, isValidID } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidID, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidID, ctrl.removeContact);

router.put(
	"/:contactId",
	isValidID,
	validateBody(schemas.addSchema),
	ctrl.updateContact
);

router.patch(
	"/:contactId/favorite",
	isValidID,
	validateBody(schemas.updateSchema),
	ctrl.updateStatusContact
);

module.exports = router;
