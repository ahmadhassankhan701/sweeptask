import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import InputText from "../../../components/Input/InputText";
import { Sizes, colors } from "../../../utils/theme";
import { Button, TextInput } from "react-native-paper";
const AddCard = () => {
	const [detail, setDetail] = useState({
		card: "",
		expiry: "",
		cvv: "",
	});
	const handleChange = async (name, value) => {};
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={{ width: Sizes.width - 50 }}>
				<View style={{ marginVertical: 30 }}>
					<InputText
						title={"Card number"}
						name={"card"}
						handleChange={handleChange}
						value={detail.card}
					/>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<TextInput
							label={"Expiry date"}
							mode="outlined"
							style={{
								backgroundColor: "#ffffff",
								width: 139,
								marginVertical: 10,
								fontSize: 12,
							}}
							outlineColor="#000000"
							activeOutlineColor={"#000000"}
							selectionColor={colors.desc}
							onChangeText={(text) => handleChange("expiry", text)}
							value={detail.expiry}
						/>
						<TextInput
							label={"Secure code"}
							mode="outlined"
							style={{
								backgroundColor: "#ffffff",
								width: 139,
								marginVertical: 10,
								fontSize: 12,
							}}
							outlineColor="#000000"
							activeOutlineColor={"#000000"}
							selectionColor={colors.desc}
							onChangeText={(text) => handleChange("cvv", text)}
							value={detail.cvv}
						/>
					</View>
				</View>
				<Button
					mode="contained"
					buttonColor="#000000"
					textColor="#ffffff"
					style={{
						borderRadius: 0,
						width: Sizes.width - 50,
						height: 55,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					Add Card
				</Button>
			</View>
		</View>
	);
};

export default AddCard;

const styles = StyleSheet.create({});
