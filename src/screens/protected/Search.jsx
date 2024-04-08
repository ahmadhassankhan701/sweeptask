import {
	StyleSheet,
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TextInput,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Sizes } from "../../utils/theme";
import Footer from "../../components/Footer";
import { FontAwesome5 } from "@expo/vector-icons";
import { sendNotification } from "../../utils/Helpers/NotifyConfig";
const Search = () => {
	const { state } = useContext(AuthContext);
	const token =
		"cEqE-wwbRPWpr-DFdOvI4K:APA91bF0uC0_ARLvvTnbQIGMr-87YN3esJx9aXlj978bwmwoGrGRYjRbg8C6RPK1SEofViUCkNtoLy-Tb1lrozCDTwTm8SH0ZXMzl4qudLAq67_pw0vMlu1HOfL3Dhe-hSb54al7P9ha";
	const [search, setSearch] = useState("");
	const handleChange = async (name, value) => {};
	return (
		<View style={[styles.container, { marginTop: 50 }]}>
			<View>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<View style={styles.wrapper}>
						<View style={styles.searchSection}>
							<FontAwesome5
								style={styles.searchIcon}
								name="search"
								size={20}
								color="#000"
							/>
							<TextInput
								style={styles.input}
								placeholder="Find services"
								onChangeText={(searchString) => {
									setSearch(searchString);
								}}
								underlineColorAndroid="transparent"
							/>
						</View>
						<Text style={styles.title}>Popular categories</Text>
						<Text style={styles.subtitle}>Home cleaning</Text>
						<Text style={styles.subtitle}>Outdoor cleaning</Text>
						<Text
							style={styles.subtitle}
							onPress={() =>
								sendNotification(
									token,
									"Test title tile",
									"test body in the meantine"
								)
							}
						>
							Send Notification
						</Text>
					</View>
				</KeyboardAvoidingView>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		height: Sizes.height,
	},
	footer: {
		height: 40,
		marginBottom: Platform.OS === "ios" ? 20 : 0,
		width: "100%",
	},
	title: {
		fontFamily: "Inter-SemiBold",
		fontStyle: "normal",
		fontSize: 20,
		lineHeight: 24,
		color: "#000000",
		width: 324,
		marginVertical: 30,
	},
	subtitle: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		color: "#000000",
		width: 206,
		textAlign: "left",
		marginVertical: 5,
	},
	wrapper: {
		width: Sizes.width - 50,
	},
	searchSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 10,
		borderWidth: 1,
		width: Sizes.width - 50,
		marginTop: 30,
	},
	searchIcon: {
		paddingRight: 10,
	},
	input: {
		backgroundColor: "#fff",
		color: "#424242",
	},
});
