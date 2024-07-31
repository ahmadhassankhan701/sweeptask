import { StyleSheet } from "react-native";
import React from "react";
import { Sizes } from "../../utils/theme";
import { TextInput } from "react-native-paper";

const ProfileField = ({ title, val, name, handleChange }) => {
	return (
		<TextInput
			label={title}
			mode="outlined"
			style={{
				backgroundColor: "#FFFFFF",
				width: Sizes.width - 20,
				alignSelf: "center",
				marginVertical: 10,
			}}
			textColor={name === "email" ? "lightgray" : "#000000"}
			outlineColor={"transparent"}
			activeOutlineColor={"gray"}
			onChangeText={(text) => {
				handleChange(name, text);
			}}
			value={val}
			keyboardType={"default"}
			disabled={name === "email" ? true : false}
		/>
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
