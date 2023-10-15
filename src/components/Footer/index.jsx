import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

export const Tab = ({
	name,
	handlePress,
	screenName,
	routeName,
}) => {
	const activeScreenColor =
		screenName === routeName ? "black" : "gray";

	return (
		<TouchableOpacity onPress={handlePress}>
			<FontAwesome5
				name={name}
				size={25}
				color="black"
				style={{
					color: activeScreenColor,
					marginBottom: 3,
					alignSelf: "center",
				}}
			/>
		</TouchableOpacity>
	);
};

export default function index() {
	const navigation = useNavigation();
	const route = useRoute();

	return (
		<View
			style={{
				width: "100%",
				borderTopEndRadius: 20,
				borderTopStartRadius: 20,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					margin: 5,
					marginHorizontal: 30,
					justifyContent: "space-between",
				}}
			>
				<Tab
					name="home"
					handlePress={() => navigation.navigate("Home")}
					screenName="Home"
					routeName={route.name}
				/>
				<Tab
					name="search"
					handlePress={() => navigation.navigate("Search")}
					screenName="Search"
					routeName={route.name}
				/>
				<Tab
					name="list-alt"
					handlePress={() => navigation.navigate("Booking")}
					screenName="Booking"
					routeName={route.name}
				/>
				<Tab
					name="user"
					handlePress={() => navigation.navigate("Account")}
					screenName="Account"
					routeName={route.name}
				/>
			</View>
		</View>
	);
}
