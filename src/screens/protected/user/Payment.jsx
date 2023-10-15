import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Sizes } from "../../../utils/theme";
import {
	Button,
	Divider,
	IconButton,
	RadioButton,
} from "react-native-paper";

const Payment = ({ navigation }) => {
	const [choice, setChoice] = useState("visa");
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={styles.wrapper}>
				<Text style={styles.title}>Payment details</Text>
				<View>
					<RadioButton.Group
						onValueChange={(newValue) =>
							setChoice(newValue)
						}
						value={choice}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginTop: 20,
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									gap: 10,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={require("../../../assets/visa.png")}
								/>
								<Text
									style={{
										fontWeight: "600",
										fontSize: 20,
									}}
								>
									....
								</Text>
								<Text>1967</Text>
							</View>
							<RadioButton value="visa" color="#000000" />
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginTop: 10,
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									gap: 10,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Image
									source={require("../../../assets/cash.png")}
								/>
								<Text>Cash</Text>
							</View>
							<RadioButton value="cash" color="#000000" />
						</View>
					</RadioButton.Group>
				</View>
				<Divider style={{ marginTop: 50 }} />
				<TouchableOpacity
					onPress={() => {
						navigation.navigate("AddCard");
					}}
				>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<IconButton
							icon="plus-box-outline"
							iconColor="#000000"
							size={30}
							style={{ marginLeft: -10 }}
						/>
						<Text
							style={{
								color: "#000000",
								fontWeight: "600",
								fontSize: 14,
							}}
						>
							Add card/credit card
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Payment;

const styles = StyleSheet.create({
	wrapper: {
		width: Sizes.width - 50,
	},
	title: {
		fontWeight: "600",
		fontSize: 16,
		lineHeight: 19,
		color: "#000000",
		marginTop: 30,
	},
});
