import { StyleSheet } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";

const InputText = ({
	title,
	icon,
	name,
	handleChange,
	showPassword,
	setShowPassword,
	value,
}) => {
	return (
		<TextInput
			label={""}
			placeholder={title}
			left={icon && <TextInput.Icon icon={icon} />}
			right={
				name == "password" ? (
					<TextInput.Icon
						onPress={() => setShowPassword(!showPassword)}
						icon={"eye"}
					/>
				) : (
					name == "service" && <TextInput.Icon icon={"chevron-down"} />
				)
			}
			mode="outlined"
			style={{
				backgroundColor: "#ffffff",
				width: Sizes.width - 50,
				marginVertical: 10,
				fontSize: 12,
			}}
			outlineColor="#000000"
			activeOutlineColor={"#000000"}
			selectionColor={colors.desc}
			onChangeText={(text) => handleChange(name, text)}
			secureTextEntry={name == "password" && !showPassword}
			multiline={name == "desc" ? true : false}
			numberOfLines={name == "desc" ? 3 : 1}
			value={value}
			keyboardType={name == "postal" ? "number-pad" : "default"}
			maxLength={name == "postal" ? 4 : null}
		/>
	);
};

export default InputText;

const styles = StyleSheet.create({});
