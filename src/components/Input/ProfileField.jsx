import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Sizes } from "../../utils/theme";

const ProfileField = ({ title, val }) => {
	return (
		<View
			style={{
				backgroundColor: "#FFFFFF",
				width: Sizes.width - 20,
				alignSelf: "center",
				height: 70,
				display: "flex",
				justifyContent: "center",
				alignItems: "flex-start",
				paddingLeft: 20,
				marginVertical: 10,
			}}
		>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.val}>{val}</Text>
		</View>
	);
};

export default ProfileField;

const styles = StyleSheet.create({
	title: {
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 19.36,
		color: "#5A5A5A",
		marginBottom: 2,
	},
	val: {
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 19.36,
		color: "#000000",
	},
});
