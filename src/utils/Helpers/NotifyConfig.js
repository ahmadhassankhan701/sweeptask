import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import axios from "axios";
import { updateDoc } from "firebase/firestore";
import Constants from "expo-constants";

export const registerForPushNotificationsAsync = async () => {
	let token;

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Premission Denied for Push Notifications");
			return false;
		}

		token = await Notifications.getExpoPushTokenAsync({
			projectId: Constants.expoConfig.extra.eas.projectId,
		});
	} else {
		alert("Must use physical device for Push Notifications");
	}

	return token;
};
export const sendNotification = async (
	push_token,
	notify_title,
	notify_body
) => {
	await axios
		.post("https://exp.host/--/api/v2/push/send", {
			to: push_token,
			title: notify_title,
			body: notify_body,
		})
		.then(function (response) {})
		.catch(function (error) {
			console.log(error);
		});
};
export const activateNotify = async (userRef) => {
	const token = await registerForPushNotificationsAsync();
	if (token.data) {
		try {
			await updateDoc(userRef, { push_token: token.data });
			return token.data;
		} catch (error) {
			console.log(error);
			return "";
		}
	} else {
		return "";
	}
};
