import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import { IconButton, Modal, Portal } from "react-native-paper";

const PlacesModal = ({ visible, setVisible, data, handleAction }) => {
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
	};
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}
				scrollable={true}
			>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "700" }}>Places</Text>
					<View style={{ marginTop: 30, marginBottom: 30 }}>
						<ScrollView showsVerticalScrollIndicator={false}>
							{data &&
								data.map((item, index) => (
									<TouchableOpacity
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
											backgroundColor: "#efefef",
											borderRadius: 10,
											marginTop: 5,
											paddingLeft: 20,
											paddingVertical: 5,
										}}
										key={index}
										onPress={() => handleAction(item)}
									>
										<Text
											style={{
												fontSize: 20,
												fontWeight: "400",
												marginVertical: 5,
											}}
										>
											{item.city}
										</Text>
										<Text
											style={{
												fontSize: 20,
												fontWeight: "400",
												marginVertical: 5,
											}}
										>
											{item.suburb}
										</Text>
										<IconButton icon={"radiobox-blank"} iconColor="gray" />
									</TouchableOpacity>
								))}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default PlacesModal;

const styles = StyleSheet.create({});
