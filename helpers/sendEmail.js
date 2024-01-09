const nodemailer = require("nodemailer");

const { GMAIL_EMAIL, GMAIL_PASSWORD, EMAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	auth: {
		user: GMAIL_EMAIL,
		pass: GMAIL_PASSWORD,
	},
	secure: true,
	port: 465,
});

const sendEmail = async (data) => {
	const email = { ...data, from: EMAIL_FROM };
	return transporter.sendMail(email);
};

module.exports = sendEmail;
