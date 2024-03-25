import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton, Text } from "react-native-paper";
import Home from "../../screens/protected/Home";
import Search from "../../screens/protected/Search";
import Booking from "../../screens/protected/Booking";
import Account from "../../screens/protected/Account";
import Profile from "../../screens/protected/user/Profile";
import AddCard from "../../screens/protected/user/AddCard";
import NewBooking from "../../screens/protected/NewBooking/NewBooking";
import BookingPlace from "../../screens/protected/NewBooking/BookingPlace";
import ConfirmBooking from "../../screens/protected/NewBooking/ConfirmBooking";
import Payment from "../../screens/protected/Payment/Payment";
import Pay from "../../screens/protected/user/Pay";
import Chat from "../../screens/protected/Chat/Chat";
import Success from "../../screens/protected/Result/Success";
import Feedback from "../../screens/protected/Feedback";
const Stack = createNativeStackNavigator();
const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="Home"
				component={Home}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Success"
				component={Success}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Feedback"
				component={Feedback}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Search"
				component={Search}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Booking"
				component={Booking}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Chat"
				component={Chat}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Account"
				component={Account}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={() => ({
					headerShown: true,
					headerTitle: "Profile",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="Payment"
				component={Payment}
				options={() => ({
					headerShown: true,
					headerTitle: "Payment",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="Pay"
				component={Pay}
				options={() => ({
					headerShown: true,
					headerTitle: "Payment",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="AddCard"
				component={AddCard}
				options={() => ({
					headerShown: true,
					headerTitle: "AddCard",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="BookingPlace"
				component={BookingPlace}
				options={() => ({
					headerShown: true,
					headerTitle: "Location",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="ConfirmBooking"
				component={ConfirmBooking}
				options={() => ({
					headerShown: true,
					headerTitle: "ConfirmBooking",
					headerTitleAlign: "center",
				})}
			/>
			<Stack.Screen
				name="NewBooking"
				component={NewBooking}
				options={() => ({
					headerShown: true,
					headerTitle: "NewBooking",
					headerTitleStyle: {
						fontSize: 16,
						fontWeight: "500",
					},
					headerTitleAlign: "center",
					// headerRight: () => (
					// 	<IconButton
					// 		icon={"map-marker"}
					// 		iconColor="#000000"
					// 	/>
					// ),
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;
