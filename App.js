import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});
export default function App() {
	const [fontsLoaded] = useFonts({
		"Inter-Regular": require("./src/assets/font/Inter-Regular.ttf"),
		"Inter-Bold": require("./src/assets/font/Inter-Bold.ttf"),
		"Inter-SemiBold": require("./src/assets/font/Inter-SemiBold.ttf"),
	});
	if (!fontsLoaded) {
		return null;
	}
	return (
		<NavigationContainer>
			<AuthProvider>
				<PaperProvider>
					<Navigation />
				</PaperProvider>
			</AuthProvider>
		</NavigationContainer>
	);
}
