/* eslint-disable */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});
app.get("/", (req, res) => {
	res.send("Hello from Firebase!");
});
app.get("/get_access_token", (req, res) => {
	try {
		const client_email = process.env.CLIENT_EMAIL;
		const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, "\n");
		const jwtClient = new google.auth.JWT(
			client_email,
			null,
			private_key,
			(SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"]),
			null
		);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				return res.json({ error: err.message });
			}
			return res.json({ access_token: tokens.access_token });
		});
	} catch (error) {
		return res.json({ error: error.message });
	}
});
// Expose Express API as a single Cloud Function:
exports.api = functions
	.runWith({ secrets: ["CLIENT_EMAIL", "PRIVATE_KEY"] })
	.https.onRequest(app);
