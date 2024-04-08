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

		token = await Notifications.getDevicePushTokenAsync({
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
	const { data } = await axios.get(
		"https://us-central1-clean-task-43018.cloudfunctions.net/api/get_access_token"
	);
	await axios
		.post(
			"https://fcm.googleapis.com/v1/projects/clean-task-43018/messages:send",
			{
				message: {
					token: push_token,
					notification: {
						title: "Breaking News",
						body: "New news story available.",
					},
					data: {
						title: "story_12345",
						// story_id: "story_12345",
					},
					android: {
						notification: {
							click_action: "TOP_STORY_ACTIVITY",
							body: "Check out the Top Story",
						},
					},
					apns: {
						payload: {
							aps: {
								category: "NEW_MESSAGE_CATEGORY",
							},
						},
					},
				},
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${data.access_token}`,
				},
			}
		)
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
