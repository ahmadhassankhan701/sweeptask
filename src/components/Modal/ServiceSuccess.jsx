import React, { useState } from "react";
import { Modal, Portal } from "react-native-paper";
import { View, TouchableOpacity, Text } from "react-native";
import { Sizes, colors } from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";

const ServiceSuccess = ({ visible, setVisible }) => {
	const navigation = useNavigation();
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
		borderRadius: 10,
	};
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}
			>
				<View>
					<View
						style={{
							marginVertical: 10,
						}}
					>
						<Text
							style={{
								color: "gray",
								textAlign: "center",
								fontSize: 18,
								fontStyle: "normal",
								fontWeight: "600",
								lineHeight: 22,
								letterSpacing: -0.4,
							}}
						>
							Hurray! We provide services in your area
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								width: "100%",
								marginTop: 20,
							}}
						>
							<View
								style={{
									flex: 1,
									borderTopWidth: 0.333,
									borderTopColor: "rgba(60, 60, 67, 0.36)",
									borderRightColor: "rgba(60, 60, 67, 0.36)",
									borderRightWidth: 0.333,
								}}
							>
								<TouchableOpacity
									style={{
										height: 50,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={() => setVisible(false)}
								>
									<Text
										style={{
											color: "red",
											textAlign: "center",
											fontSize: 17,
											fontStyle: "normal",
											fontWeight: "400",
											lineHeight: 22,
											letterSpacing: -0.4,
											marginTop: 10,
										}}
									>
										Close
									</Text>
								</TouchableOpacity>
							</View>
							<View
								style={{
									flex: 1,
									borderTopWidth: 0.333,
									borderTopColor: "rgba(60, 60, 67, 0.36)",
								}}
							>
								<TouchableOpacity
									style={{
										height: 50,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={() => {
										setVisible(false);
										navigation.navigate("NewBooking");
									}}
								>
									<Text
										style={{
											color: "gray",
											textAlign: "center",
											fontSize: 17,
											fontStyle: "normal",
											fontWeight: "400",
											lineHeight: 22,
											letterSpacing: -0.4,
											marginTop: 10,
										}}
									>
										Book Now
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default ServiceSuccess;
