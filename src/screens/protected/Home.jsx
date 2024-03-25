import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Sizes, colors } from "../../utils/theme";
import { Button, IconButton, Modal, Portal } from "react-native-paper";
import Footer from "../../components/Footer";
import FindService from "../../components/Map/FindService";
import Slider from "@react-native-community/slider";
import { Image } from "react-native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import haversineDistance from "haversine-distance";
import { db } from "../../../firebase";
import * as Location from "expo-location";
import ServiceSuccess from "../../components/Modal/ServiceSuccess";

const Home = () => {
	const [visible, setVisible] = useState(false);
	const [placeVisible, setPlaceVisible] = useState(false);
	const [successVisible, setSuccessVisible] = useState(false);
	const [range, setRange] = useState("");
	const [choice, setChoice] = useState("current");
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		height: 300,
		alignSelf: "center",
	};
	const placeContainerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 20,
		height: 500,
		alignSelf: "center",
	};
	const [detail, setDetail] = useState({
		service: "",
		postal: "",
	});
	const [loading] = useState(false);
	const [location, setLocation] = useState({
		city: "",
		address: "",
		currentLocation: { lat: 0, lng: 0 },
	});
	const handleChangeLoc = async (address, city, pos) => {
		setLocation({
			...location,
			city,
			address,
			currentLocation: pos,
		});
	};
	const handleSelect = (value) => {
		setDetail({ ...detail, service: value });
		hideModal();
	};
	const handleNearby = async () => {
		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				alert("Please grant location permissions");
				return;
			}
			let currentLocation = await Location.getCurrentPositionAsync({});
			await getPro(
				currentLocation.coords.latitude,
				currentLocation.coords.longitude
			);
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleInputSearch = async () => {
		if (detail.service === "" || location.address === "") {
			alert("Please fill all fields");
			return;
		}
		if (
			location.currentLocation.lat === 0 ||
			location.currentLocation.lng === 0
		) {
			alert("Please select a location");
			return;
		}
		await getPro(location.currentLocation.lat, location.currentLocation.lng);
	};
	const getPro = async (custLat, custLng) => {
		const pros = query(
			collection(db, "Users"),
			where("role", "==", "professional"),
			orderBy("createdAt", "asc")
		);
		const items = [];
		getDocs(pros)
			.then((querySnapshot) => {
				if (querySnapshot.size == 0) {
					alert("No professional found");
					return;
				}
				querySnapshot.forEach((doc) => {
					items.push({ key: doc.id, ...doc.data() });
				});
				filterByRange(items, range, custLat, custLng);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const filterByRange = async (items, range, custLat, custLng) => {
		try {
			let kmRange = range * 1000;
			const filteredPros = items.filter((item) => {
				let distance = haversineDistance(
					{
						latitude: parseInt(item.location.lat),
						longitude: parseInt(item.location.lng),
					},
					{
						latitude: parseInt(custLat),
						longitude: parseInt(custLng),
					}
				);
				if (distance <= kmRange) {
					return true;
				}
			});
			if (Object.keys(filteredPros).length == 0) {
				setLocation({
					city: "",
					address: "",
					currentLocation: { lat: 0, lng: 0 },
				});
				setPlaceVisible(false);
				alert("No professional found. Try changing range");
				return;
			} else {
				setPlaceVisible(false);
				setRange("");
				setDetail((detail) => ({ ...detail, service: "" }));
				setLocation({
					city: "",
					address: "",
					currentLocation: { lat: 0, lng: 0 },
				});
				setSuccessVisible(true);
				return;
			}
		} catch (error) {
			alert(error.message);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ServiceSuccess visible={successVisible} setVisible={setSuccessVisible} />
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
					<View>
						<Text
							style={{
								color: "#000",
								marginBottom: 5,
								marginTop: 10,
								fontSize: 15,
							}}
						>
							Distance Range (kms)
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								width: Sizes.width - 50,
								backgroundColor: "#000",
								padding: 10,
								borderRadius: 5,
							}}
						>
							<Text style={{ color: "#fff", fontSize: 15 }}>5</Text>
							<Slider
								style={{ width: 250, height: 50 }}
								minimumValue={5}
								maximumValue={25}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#FFFFFF"
								step={2}
								onSlidingComplete={(value) => {
									setRange(value);
								}}
							/>
							<Text style={{ color: "#fff", fontSize: 15 }}>
								{range == "" ? 20 : range}
							</Text>
						</View>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginTop: 20,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								setChoice("place");
								setPlaceVisible(true);
							}}
							style={{ width: "100%" }}
						>
							<Button
								mode={choice === "place" ? "contained" : "text"}
								buttonColor={choice === "place" ? "black" : "white"}
								textColor={choice === "place" ? "white" : "black"}
								style={{
									borderRadius: 5,
									marginTop: 20,
									width: "100%",
									height: 50,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								Search Place
							</Button>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setChoice("current");
								handleNearby();
							}}
							style={{ width: "100%" }}
						>
							<Button
								mode={choice === "current" ? "contained" : "text"}
								buttonColor={choice === "current" ? "black" : "white"}
								textColor={choice === "current" ? "white" : "black"}
								style={{
									borderRadius: 5,
									marginTop: 20,
									width: "100%",
									height: 50,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								Search Nearby
							</Button>
						</TouchableOpacity>
					</View>
					<Portal>
						<Modal
							visible={placeVisible}
							onDismiss={() => setPlaceVisible(false)}
							contentContainerStyle={placeContainerStyle}
						>
							<View style={{ height: "100%" }}>
								<Text
									style={{
										textAlign: "center",
										fontSize: 15,
										fontWeight: "800",
										marginBottom: 30,
									}}
								>
									Place Search
								</Text>
								<View>
									<FindService
										location={location}
										handleChange={handleChangeLoc}
									/>
								</View>
								<View>
									{location.currentLocation.lat !== 0 &&
										location.currentLocation.lng !== 0 && (
											<TouchableOpacity
												style={{
													width: "100%",
												}}
												onPress={handleInputSearch}
											>
												<Button
													mode="contained"
													style={{
														backgroundColor: "#000000",
														color: "#ffffff",
														borderRadius: 5,
														marginVertical: 20,
														width: "100%",
														height: 50,
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
												>
													Search
												</Button>
											</TouchableOpacity>
										)}
								</View>
							</View>
						</Modal>
					</Portal>
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
