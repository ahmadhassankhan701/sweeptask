import {
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import React from "react";
import { Sizes } from "../../../utils/theme";
import { useState } from "react";
import { Button } from "react-native-paper";
import CustomerMap from "../../../components/Map/index";
const BookingPlace = ({ route, navigation }) => {
	const { details, extras, date } = route.params;
	const [loading, setLoading] = useState(false);
	const [location, setLocation] = useState({
		city: "",
		address: "",
		currentLocation: { lat: 0, lng: 0 },
	});
	const handleChange = async (address, city, pos) => {
		setLocation({
			...location,
			city,
			address,
			currentLocation: pos,
		});
	};
	const handleNext = async () => {
		if (
			location.city === "" ||
			location.address === "" ||
			location.address === "null, null, null" ||
			location.currentLocation.lat === 0 ||
			location.currentLocation.lng === 0
		) {
			alert("Location not added yet");
			return;
		}
		navigation.navigate("ConfirmBooking", {
			details,
			extras,
			date,
			location,
		});
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			{/* <Text>{JSON.stringify(location, null, 4)}</Text> */}
			{loading && (
				<View
					style={{
						position: "absolute",
						backgroundColor: "#000000",
						opacity: 0.7,
						zIndex: 999,
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={require("../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<View style={styles.cover}>
				<CustomerMap
					location={location}
					handleChange={handleChange}
					setLoading={setLoading}
				/>
			</View>
			<View
				style={{
					marginTop: 20,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
				}}
			>
				<Button
					icon={"arrow-left"}
					mode="contained"
					buttonColor={"#000000"}
					textColor="#ffffff"
					style={{ borderRadius: 0 }}
					onPress={() => navigation.goBack()}
				>
					Previous
				</Button>
				<Button
					icon={"arrow-right"}
					mode="contained"
					buttonColor={"#000000"}
					textColor="#ffffff"
					style={{ borderRadius: 0 }}
					onPress={handleNext}
					contentStyle={{ flexDirection: "row-reverse" }}
				>
					Next
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

export default BookingPlace;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	cover: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: Sizes.width - 10,
	},
});
