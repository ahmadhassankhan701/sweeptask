import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Login";
import Register from "../../screens/Register";
const Stack = createNativeStackNavigator();
const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="Login"
				component={Login}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Register"
				component={Register}
				options={() => ({
					headerShown: false,
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;
