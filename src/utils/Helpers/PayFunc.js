import axios from "axios";
import { SECRET_KEY } from "./keys";

const baseUrl = "https://api.paystack.co";

export const createReCheckout = async (
	email,
	amount,
	currency,
	authorization_code
) => {
	try {
		const checkBody = {
			email,
			amount: amount * 100,
			currency,
			authorization_code,
			metadata: {
				cancel_action: "https://example.com/cancel",
			},
		};
		const { data } = await axios.post(
			baseUrl + "/transaction/charge_authorization",
			checkBody,
			{
				headers: {
					Authorization: `Bearer ${SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);
		if (data.status) {
			return data.data;
		}
		return null;
	} catch (error) {
		console.log(error);
	}
};
export const createCheckout = async (email, amount, currency, callback_url) => {
	try {
		const checkBody = { email, amount: amount * 100, currency, callback_url };
		const { data } = await axios.post(
			baseUrl + "/transaction/initialize",
			checkBody,
			{
				headers: {
					Authorization: `Bearer ${SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);
		if (data.status) {
			return data.data;
		}
		return null;
	} catch (error) {
		console.log(error);
	}
};
export const verifyTransaction = async (reference) => {
	try {
		const { data } = await axios.get(
			`${baseUrl}/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${SECRET_KEY}`,
				},
			}
		);
		if (data.status) {
			return data.data;
		}
		return null;
	} catch (error) {
		console.log(error);
	}
};
