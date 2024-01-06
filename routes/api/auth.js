const express = require("express");
const {
	emptyBody,
	validateBody,
	authenticate,
	upload,
} = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const router = express.Router();

router.post(
	"/register",
	emptyBody(),
	validateBody(schemas.registerSchema),
	ctrl.register
);
router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
	"/verify",
	validateBody(schemas.verifyEmailSchema),
	ctrl.resendVerifyEmail
);
router.post(
	"/login",
	emptyBody(),
	validateBody(schemas.loginSchema),
	ctrl.login
);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);
router.patch(
	"/:userId/subscription",
	authenticate,
	validateBody(schemas.updateSubscriptionSchema),
	ctrl.updateSubscriptionUser
);
router.patch(
	"/avatars",
	authenticate,
	upload.single("avatar"),
	ctrl.updateAvatar
);

module.exports = router;
