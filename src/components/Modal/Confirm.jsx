import { StyleSheet, Text } from "react-native";
import React from "react";
import { Button, Dialog, Divider, Portal } from "react-native-paper";
import { View } from "react-native";

const Confirm = ({
	visible,
	setVisible,
	title,
	subtitle,
	icon,
	handleAction,
}) => {
	const hideDialog = () => setVisible(false);
	return (
		<Portal>
			<Dialog
				style={{ backgroundColor: "#000" }}
				visible={visible}
				onDismiss={hideDialog}
			>
				<Dialog.Icon icon={icon} color="white" />
				<Divider
					style={{
						backgroundColor: "gray",
						borderColor: "gray",
						borderWidth: 1,
						marginVertical: 5,
					}}
				/>
				<Dialog.Title
					style={{
						color: "#fff",
						textAlign: "center",
					}}
				>
					{title}
				</Dialog.Title>
				<Dialog.Content>
					<Text style={{ color: "#fff" }} variant="bodyMedium">
						{subtitle}
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
								roundness: 5,
							}}
							textColor="#fff"
							buttonColor="red"
						>
							Cancel
						</Button>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Button
							mode="contained"
							buttonColor="green"
							onPress={handleAction}
							theme={{ roundness: 5 }}
						>
							Proceed
						</Button>
					</View>
				</View>
			</Dialog>
		</Portal>
	);
};

export default Confirm;

const styles = StyleSheet.create({});
