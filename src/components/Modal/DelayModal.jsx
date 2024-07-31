import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { IconButton, Modal, Portal, TextInput } from "react-native-paper";
import { Sizes } from "../../utils/theme";
import moment from "moment";

const DelayModal = ({ visible, setVisible, handleDelay, delay }) => {
	const [newDate, setNewDate] = useState("");
	const [newDisplayDate, setNewDisplayDate] = useState("");
	const [daysError, setDaysError] = useState("");
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	const handleChange = async (text) => {
		if (text === "") {
			setNewDate("");
			setNewDisplayDate("");
			return;
		}
		var result = new Date(delay.prevDate);
		result.setDate(result.getDate() + parseInt(text));
		setNewDate(result);
		setNewDisplayDate(moment(result).format("ddd , DD MMMM YYYY"));
		if (isNaN(+text)) {
			setDaysError("Only numbers allowed");
		} else {
			setDaysError("");
		}
	};
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}
			>
				<View>
					<Text>
						Previous Date:{" "}
						{moment(new Date(delay.prevDate)).format("dd , DD MMMM YYYY")}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							width: "100%",
						}}
					>
						<TextInput
							mode="outlined"
							placeholder="Days To Delay"
							style={{ width: "100%" }}
							keyboardType="numeric"
							onChangeText={(text) => handleChange(text)}
							maxLength={2}
						/>
					</View>
					<View>
						{daysError !== "" && (
							<Text
								style={{
									textAlign: "center",
									color: "red",
								}}
							>
								{daysError}
							</Text>
						)}
					</View>
					<Text>
						New Date:{" "}
						{newDisplayDate != "" && JSON.stringify(newDisplayDate, null, 4)}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-around",
							alignItems: "center",
						}}
					>
						<IconButton
							icon={"check-circle"}
							iconColor="green"
							size={35}
							onPress={() => handleDelay(newDate)}
							disabled={newDate === "" || daysError !== ""}
						/>
						<IconButton
							icon={"close-circle"}
							iconColor="red"
							size={35}
							onPress={hideModal}
						/>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default DelayModal;

const styles = StyleSheet.create({});
