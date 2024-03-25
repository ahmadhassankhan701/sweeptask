import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { Button } from "react-native-paper";

const Success = ({ route, navigation }) => {
	const { title, desc, to } = route.params;
	return (
		<View style={styles.container}>
			<ImageBackground
				source={require("../../../assets/success_bg.jpg")}
				style={styles.backgroundImage}
			>
				<View style={styles.message}>
					<View
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.desc}>{desc}</Text>
						<Button
							mode="contained"
							buttonColor="#000"
							textColor="#fff"
							theme={{ roundness: 0 }}
							onPress={() => {
								navigation.navigate(to);
							}}
						>
							Back
						</Button>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

export default Success;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		resizeMode: "cover", // or 'stretch',
	},
	message: {
		position: "absolute",
		top: "40%",
		left: "5%",
	},
	title: {
		fontSize: 24,
		color: "#000",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	desc: {
		fontSize: 18,
		color: "gray",
		fontWeight: "400",
		marginBottom: 20,
	},
});
