/* eslint-disable */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});
app.get("/", (req, res) => {
	res.send("Hello from Firebase!");
});
app.post("/send_notification", async (req, res) => {
	const { push_token, notify_title, notify_body } = req.body;
	try {
		const message = {
			token: push_token,
			notification: {
				title: notify_title,
				body: notify_body,
			},
			data: {
				title: notify_body,
				subtitle: notify_title,
				body: notify_body,
				custom: "This is a notification that will be sent to the user",
				Trotric: "Mabuso",
			},
		};
		const response = await admin.messaging().send(message);
		functions.logger.info("Message sent successfully", response);
		return res.json({ message: "Message sent successfully" });
	} catch (error) {
		functions.logger.error("Error sending message: ", error);
		return res.json({ error: error.message });
	}
});
// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
