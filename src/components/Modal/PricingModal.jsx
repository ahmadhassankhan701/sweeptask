import { StyleSheet, Text } from "react-native";
import React from "react";
import {
	Button,
	Dialog,
	Divider,
	IconButton,
	Portal,
} from "react-native-paper";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PricingModal = ({ visible, setVisible, data }) => {
	const navigation = useNavigation();
	const hideDialog = () => setVisible(false);
	return (
		<Portal>
			<Dialog
				style={{ backgroundColor: "#000", borderRadius: 10 }}
				visible={visible}
				onDismiss={hideDialog}
			>
				<Dialog.Title
					style={{
						color: "#fff",
						textAlign: "center",
						fontSize: 20,
					}}
				>
					Price Estimate
				</Dialog.Title>
				<Divider
					style={{
						backgroundColor: "gray",
						borderColor: "gray",
						borderWidth: 1,
						marginVertical: 5,
					}}
				/>
				<Dialog.Content>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Text style={{ color: "#fff" }} variant="bodyMedium">
							Bedrooms: {data.bedrooms}
						</Text>
						<Text style={{ color: "#fff" }} variant="bodyMedium">
							Bathrooms: {data.bathrooms}
						</Text>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							gap: 10,
							marginTop: 10,
						}}
					>
						<Text style={{ color: "#fff" }} variant="bodyMedium">
							Ironing: {data.ironing ? "Yes" : "No"}
						</Text>
						<Text style={{ color: "#fff" }} variant="bodyMedium">
							Laundry: {data.laundry ? "Yes" : "No"}
						</Text>
						<Text style={{ color: "#fff" }} variant="bodyMedium">
							Bin: {data.bin ? "Yes" : "No"}
						</Text>
					</View>
				</Dialog.Content>

				<Dialog.Content>
					<Text style={{ color: "#fff" }} variant="bodyMedium">
						Total Price: R{data.cost} including app charges R{data.commission}
					</Text>
				</Dialog.Content>
				<Divider
					style={{
						backgroundColor: "gray",
						borderColor: "gray",
						borderWidth: 1,
						marginVertical: 2,
					}}
				/>
				<View
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						padding: 5,
						gap: 5,
					}}
				>
					<View
						style={{
							flex: 1,
							borderColor: "gray",
						}}
					>
						<Button
							mode="outlined"
							onPress={hideDialog}
							theme={{
								roundness: 2,
							}}
							textColor="#fff"
							buttonColor="green"
							onPressIn={() => {
								hideDialog();
								navigation.navigate("NewBooking");
							}}
						>
							Book Now
						</Button>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Button
							mode="contained"
							buttonColor="orange"
							onPress={hideDialog}
							theme={{ roundness: 2 }}
						>
							Ok
						</Button>
					</View>
				</View>
			</Dialog>
		</Portal>
	);
};

export default PricingModal;

const styles = StyleSheet.create({});
