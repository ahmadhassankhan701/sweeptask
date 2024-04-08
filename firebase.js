import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import {
	API_KEY,
	AUTH_DOMAIN,
	PROJECT_ID,
	STORAGE_BUCKET,
	MESSAGING_SENDER_ID,
	MEASUREMENT_ID,
	APP_ID,
} from "./src/utils/Helpers/keys";
const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	measurementId: MEASUREMENT_ID,
	appId: APP_ID,
};

export const app = initializeApp(firebaseConfig, "clean-task");
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
