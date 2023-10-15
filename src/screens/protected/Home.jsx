import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	Touchable,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Sizes, colors } from "../../utils/theme";
import InputText from "../../components/Input/InputText";
import {
	Button,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import Footer from "../../components/Footer";
const Home = () => {
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		height: 300,
		alignSelf: "center",
	};
	const [detail, setDetail] = useState({
		service: "",
		postal: "",
	});
	const [loading, setLoading] = useState(false);
	const handleSelect = (value) => {
		setDetail({ ...detail, service: value });
		hideModal();
	};
	const handleChange = async (name, value) => {
		setDetail({ ...detail, [name]: value });
	};
	const handleSubmit = async () => {
		if (detail.service === "" || detail.postal === "") {
			alert("Please fill all fields");
			return;
		}
		alert(
			"Congratulation your area is covered for this service. Make a booking now!"
		);
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-between",
				alignItems: "center",
				height: Sizes.height,
				marginTop: 50,
			}}
		>
			<View>
				<KeyboardAvoidingView
					behavior={
						Platform.OS === "ios" ? "padding" : "height"
					}
				>
					<View style={styles.wrapper}>
						<Text style={styles.title}>
							Find rated and trusted professional cleaners
							and more around you
						</Text>
						<Text style={styles.subtitle}>
							Get free quotes{" "}
						</Text>
						<TouchableOpacity onPress={showModal}>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									borderWidth: 1,
									borderColor: "#000000",
									borderRadius: 5,
									paddingHorizontal: 20,
									backgroundColor: "#ffffff",
								}}
							>
								<Text>
									{detail.service
										? detail.service === "home"
											? "Home cleaning"
											: "Outdoor cleaning"
										: "What service are you looking for?"}
								</Text>
								<IconButton icon={"chevron-down"} />
							</View>
						</TouchableOpacity>
						<InputText
							title={"Suburb or Postal code"}
							icon={"map-marker"}
							name={"postal"}
							handleChange={handleChange}
							value={detail.postal}
						/>
						<Button
							mode="contained"
							style={{
								backgroundColor: "#000000",
								color: "#ffffff",
								borderRadius: 0,
								marginVertical: 20,
							}}
							onPress={handleSubmit}
							loading={loading}
						>
							Search
						</Button>
						<Portal>
							<Modal
								visible={visible}
								onDismiss={hideModal}
								contentContainerStyle={containerStyle}
							>
								<View>
									<Text
										style={{
											textAlign: "center",
											fontSize: 15,
											fontWeight: "800",
											marginBottom: 30,
										}}
									>
										Popular categories
									</Text>
									<View
										style={{
											display: "flex",
											marginVertical: 10,
										}}
									>
										<Text
											style={{ marginVertical: 20 }}
											onPress={() => handleSelect("home")}
										>
											Home cleaning
										</Text>
										<Text
											onPress={() =>
												handleSelect("outdoor")
											}
										>
											Outdoor cleaning
										</Text>
									</View>
								</View>
							</Modal>
						</Portal>
					</View>
				</KeyboardAvoidingView>
			</View>
			<Footer />
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	title: {
		fontFamily: "Inter-Bold",
		fontStyle: "normal",
		fontSize: 24,
		lineHeight: 29,
		color: "#000000",
		width: 324,
		marginTop: 20,
	},
	subtitle: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		color: "#000000",
		width: 206,
		textAlign: "left",
		marginVertical: 30,
	},
	wrapper: {
		width: Sizes.width - 50,
	},
});
