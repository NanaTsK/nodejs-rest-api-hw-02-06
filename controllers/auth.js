const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { handleResizeAvatar } = require("../helpers");

const { User } = require("../models/user");
const { ctrlWrapper, HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;
const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const avatarURL = gravatar.url(email);
	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
	});
	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, "Email or password invalid");
	}
	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password invalid");
	}

	const payload = {
		id: user._id,
	};
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
	const userWithToken = await User.findByIdAndUpdate(user._id, { token });
	res.status(200).json({
		token,
		user: {
			email: userWithToken.email,
			subscription: userWithToken.subscription,
		},
	});
};

const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;
	res.status(200).json({
		email,
		subscription,
	});
};

const logout = async (req, res, next) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });
	res.status(204).send();
};

const updateSubscriptionUser = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
	if (!result) {
		throw HttpError(404, "Not found");
	}
	res.status(200).json({
		message: `Your subscription changed to ${req.body.subscription}!`,
	});
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	if (!req.file) {
		throw HttpError(400, "File not found");
	}
	const { path: tempUpload, originalname } = req.file;
	const filename = `${_id}_${originalname}`;

	const resultUpload = path.join(avatarDir, filename);
	const avatarURL = path.join("avatars", filename);

	await handleResizeAvatar(tempUpload);
	await fs.rename(tempUpload, resultUpload);

	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
	updateAvatar: ctrlWrapper(updateAvatar),
};
