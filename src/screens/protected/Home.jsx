import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Sizes } from "../../utils/theme";
import { Button, Divider, IconButton, Modal, Portal } from "react-native-paper";
import Footer from "../../components/Footer";
import { Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import PricingModal from "../../components/Modal/PricingModal";

const Home = () => {
	const { state } = useContext(AuthContext);
	const [visible, setVisible] = useState(false);
	const [estimate, setEstimate] = useState(null);
	const [successVisible, setSuccessVisible] = useState(false);
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
		bedrooms: 0,
		bathrooms: 0,
		laundry: false,
		ironing: false,
		bin: false,
		service: "",
	});
	const [loading, setLoading] = useState(false);
	const handleSelect = (value) => {
		setDetail({ ...detail, service: value });
		hideModal();
	};
	const handleEstimate = async () => {
		if (detail.service === "") {
			alert("Please select a service");
			return;
		}
		try {
			setLoading(true);
			const { suburbId } = state.user;
			const pricingRef = doc(db, "Pricing", suburbId);
			const pricingSnap = await getDoc(pricingRef);
			if (pricingSnap.exists() && pricingSnap.data()) {
				const {
					oneBedroomPrice,
					oneBathroomPrice,
					bedPerInc,
					bathPerInc,
					laundry,
					ironing,
					bin,
					appCommission,
				} = pricingSnap.data();
				const bedCost =
					detail.bedrooms > 0
						? detail.bedrooms > 1
							? parseInt(oneBedroomPrice) +
							  (detail.bedrooms - 1) *
									((parseInt(bedPerInc) * parseInt(oneBedroomPrice)) / 100)
							: oneBedroomPrice
						: 0;
				const bathCost =
					detail.bathrooms > 0
						? detail.bathrooms > 1
							? parseInt(oneBathroomPrice) +
							  (detail.bathrooms - 1) *
									((parseInt(bathPerInc) * parseInt(oneBathroomPrice)) / 100)
							: oneBathroomPrice
						: 0;
				let extrasCost = 0;
				if (detail.laundry) {
					extrasCost += parseInt(laundry);
				}
				if (detail.ironing) {
					extrasCost += parseInt(ironing);
				}
				if (detail.bin) {
					extrasCost += parseInt(bin);
				}
				const totalCost =
					parseInt(bedCost) + parseInt(bathCost) + parseInt(extrasCost);
				setEstimate({
					bedrooms: detail.bedrooms,
					bathrooms: detail.bathrooms,
					laundry: detail.laundry,
					ironing: detail.ironing,
					bin: detail.bin,
					cost: totalCost,
					commission: parseInt(((totalCost * appCommission) / 100).toFixed()),
				});
				setDetail({
					bedrooms: 0,
					bathrooms: 0,
					laundry: false,
					ironing: false,
					bin: false,
					service: "",
				});
				setLoading(false);
				setSuccessVisible(true);
			} else {
				setLoading(false);
				alert("Could not fetch pricing details");
			}
		} catch (error) {
			setLoading(false);
			alert("Error getting estimate");
			console.log(error);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			{loading && (
				<View
					style={{
						position: "absolute",
						backgroundColor: "#000000",
						opacity: 0.7,
						zIndex: 999,
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={require("../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				{estimate && (
					<PricingModal
						visible={successVisible}
						setVisible={setSuccessVisible}
						data={estimate}
					/>
				)}
				<View style={[styles.wrapper, { marginTop: 20 }]}>
					<View style={styles.main}>
						<Text style={styles.title}>
							Find rated and trusted professional cleaners and more around you
						</Text>
						<Text style={styles.subtitle}>Get free quotes </Text>
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
									paddingHorizontal: 10,
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
						<Text style={styles.EstimateTitle}>House Rooms</Text>
						<Divider
							style={{
								marginTop: 5,
								backgroundColor: "#B7B7B7",
								borderWidth: 0.3,
								borderColor: "#B7B7B7",
							}}
						/>
						<View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text>Bedrooms</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										gap: 10,
									}}
								>
									<IconButton
										iconColor="#828282"
										size={40}
										icon={"minus-box"}
										onPress={() => {
											if (detail.bedrooms > 0) {
												setDetail({
													...detail,
													bedrooms: parseInt(detail.bedrooms) - 1,
												});
											}
										}}
									/>
									<Text
										style={{
											fontWeight: "700",
											fontSize: 20,
										}}
									>
										{detail.bedrooms}
									</Text>
									<IconButton
										iconColor="#828282"
										size={40}
										icon={"plus-box"}
										onPress={() => {
											if (detail.bedrooms < 10) {
												setDetail({
													...detail,
													bedrooms: parseInt(detail.bedrooms) + 1,
												});
											}
										}}
									/>
								</View>
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text>Bathrooms</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										gap: 10,
									}}
								>
									<IconButton
										iconColor="#828282"
										size={40}
										icon={"minus-box"}
										onPress={() => {
											if (detail.bathrooms > 0) {
												setDetail({
													...detail,
													bathrooms: parseInt(detail.bathrooms) - 1,
												});
											}
										}}
									/>
									<Text
										style={{
											fontWeight: "700",
											fontSize: 20,
										}}
									>
										{detail.bathrooms}
									</Text>
									<IconButton
										iconColor="#828282"
										size={40}
										icon={"plus-box"}
										onPress={() => {
											if (detail.bathrooms < 10) {
												setDetail({
													...detail,
													bathrooms: parseInt(detail.bathrooms) + 1,
												});
											}
										}}
									/>
								</View>
							</View>
						</View>
						<Text style={styles.EstimateTitle}>Extras</Text>
						<Divider
							style={{
								marginTop: 5,
								backgroundColor: "#B7B7B7",
								borderWidth: 0.3,
								borderColor: "#B7B7B7",
							}}
						/>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
								marginVertical: 20,
							}}
						>
							<TouchableOpacity
								onPress={() => {
									setDetail({ ...detail, laundry: !detail.laundry });
								}}
							>
								<View
									style={
										detail.laundry
											? {
													borderBottomColor: "#000000",
													borderBottomWidth: 5,
											  }
											: { border: "none" }
									}
								>
									<Image source={require("../../assets/basket.png")} />
									<Text
										style={{
											fontWeight: "400",
											fontSize: 15,
											marginVertical: 5,
										}}
									>
										Laundry
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setDetail({ ...detail, bin: !detail.bin })}
							>
								<View
									style={[
										detail.bin
											? {
													borderBottomColor: "#000000",
													borderBottomWidth: 5,
											  }
											: { border: "none" },
										{ alignItems: "center" },
									]}
								>
									<Image
										source={require("../../assets/bin.png")}
										style={{ width: 50, height: 50 }}
									/>
									<Text
										style={{
											fontWeight: "400",
											fontSize: 15,
											marginVertical: 5,
										}}
									>
										Bin
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() =>
									setDetail({ ...detail, ironing: !detail.ironing })
								}
							>
								<View
									style={
										detail.ironing
											? {
													borderBottomColor: "#000000",
													borderBottomWidth: 5,
											  }
											: { border: "none" }
									}
								>
									<Image source={require("../../assets/iron.png")} />
									<Text
										style={{
											fontWeight: "400",
											fontSize: 15,
											marginVertical: 5,
										}}
									>
										Ironing
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						<Button
							mode="contained"
							style={{
								backgroundColor: "#000",
								marginTop: 10,
								borderRadius: 5,
							}}
							onPress={handleEstimate}
						>
							Get Estimate
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
										<Text onPress={() => handleSelect("outdoor")}>
											Outdoor cleaning
										</Text>
									</View>
								</View>
							</Modal>
						</Portal>
					</View>
				</View>
			</ScrollView>
			<View style={styles.footer}>
				<Footer />
			</View>
		</KeyboardAvoidingView>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		height: Sizes.height,
		justifyContent: "space-between",
	},
	wrapper: {
		width: Sizes.width - 50,
		flexGrow: 1,
	},
	footer: {
		height: 40,
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: Platform.OS === "ios" ? 20 : 0,
	},
	title: {
		fontFamily: "Inter-Bold",
		fontStyle: "normal",
		fontSize: 24,
		lineHeight: 29,
		color: "#000000",
		width: 324,
		marginTop: 30,
	},
	EstimateTitle: {
		fontFamily: "Inter-Bold",
		fontStyle: "normal",
		fontSize: 20,
		lineHeight: 29,
		color: "#000000",
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
		marginVertical: 15,
	},
});
