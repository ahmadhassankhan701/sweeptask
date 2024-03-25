import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Sizes } from "../../utils/theme";
import Footer from "../../components/Footer";
import {
	Avatar,
	Button,
	IconButton,
	List,
	Modal,
	Portal,
} from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment";

const Account = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [visible, setVisible] = useState(false);
	const [promoVisible, setPromoVisible] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const [promoDetails, setPromoDetails] = useState({
		promo: "",
		promoDate: 0,
		promoValue: 0,
	});
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	useEffect(() => {
		state && state.user && checkForPromo();
	}, [state && state.user]);
	const checkForPromo = async () => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Pricing", state.user.suburbId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists() && docSnap.data().promo) {
				const promoRef = doc(db, "Promo", docSnap.data().promo.promo);
				const promoSnap = await getDoc(promoRef);
				if (promoSnap.exists() && promoSnap.data().users) {
					const usersInPromo = promoSnap.data().users;
					const userExists = usersInPromo.includes(state.user.uid);
					if (!userExists) {
						const { promo, promoDate, promoValue } = promoSnap.data();
						setPromoDetails({
							...promoDetails,
							promo,
							promoDate,
							promoValue,
						});
						setPromoVisible(true);
					}
				}
			}
			setActionLoading(false);
		} catch (error) {
			setActionLoading(false);
			console.log(error);
		}
	};
	const handleActivation = async () => {
		try {
			setActionLoading(true);
			const promoData = {
				promo: promoDetails,
			};
			const userRef = doc(db, "Users", state.user.uid);
			const promoRef = doc(db, "Promo", promoDetails.promo);
			await updateDoc(userRef, promoData);
			await updateDoc(promoRef, {
				users: arrayUnion(state.user.uid),
			});
			setActionLoading(false);
			setPromoVisible(false);
			alert("Promo activated successfully");
		} catch (error) {
			setActionLoading(false);
			alert(error.message);
			console.log(error);
		}
	};
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem("clean_auth");
			setState({ ...state, user: null });
			navigation.navigate("Login");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			{actionLoading && (
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
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text style={{ textAlign: "center" }}>
							Are you sure you want to logout?
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
								onPress={handleLogout}
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
			<View>
				<View style={[styles.wrapper, { marginTop: 50 }]}>
					<TouchableOpacity onPress={() => navigation.navigate("Profile")}>
						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
								gap: 10,
								marginBottom: 20,
							}}
						>
							<View>
								<Avatar.Icon size={40} icon="account" />
							</View>
							<View>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 20,
									}}
								>
									{state && state.user && state.user.name}
								</Text>
								<Text
									style={{
										fontWeight: "400",
										fontSize: 16,
									}}
								>
									{state && state.user && state.user.email}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
					{promoVisible && (
						<View
							style={{
								backgroundColor: "#000",
								color: "#fff",
								paddingHorizontal: 10,
								borderRadius: 5,
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: "red",
										textAlign: "center",
										fontSize: 20,
										fontWeight: "700",
									}}
								>
									Promo Alert
								</Text>
								<IconButton iconColor="red" icon={"alert"} />
							</View>
							<Text
								style={{
									color: "#fff",
									fontSize: 16,
								}}
							>
								Hurray! There is promo discount in your area.
							</Text>
							<Text
								style={{
									color: "#fff",
									fontWeight: "700",
									marginTop: 10,
								}}
							>
								Promo code is: {promoDetails.promo}
							</Text>
							<Text
								style={{
									color: "#fff",
									fontWeight: "700",
									marginTop: 10,
								}}
							>
								Valid till:{" "}
								{moment(promoDetails.promoDate.seconds * 1000).format(
									"DD/MM/YYYY"
								)}
							</Text>
							<Text
								style={{
									color: "#fff",
									fontWeight: "700",
									marginTop: 10,
								}}
							>
								Discount: {promoDetails.promoValue}
							</Text>
							<Button
								mode="contained"
								buttonColor="#fff"
								textColor="#000"
								theme={{ roundness: 1 }}
								style={{
									width: 100,
									alignSelf: "center",
									marginVertical: 10,
								}}
								onPress={handleActivation}
							>
								Activate
							</Button>
						</View>
					)}
					<List.Section style={{ marginLeft: 10 }}>
						<List.Item
							title="Payments"
							left={() => <List.Icon icon="wallet-outline" />}
							onPress={() => navigation.navigate("Pay")}
						/>
						<List.Item
							title="Messages"
							left={() => <List.Icon icon="chat-processing-outline" />}
							onPress={() => alert("Coming Soon")}
						/>
						<List.Item
							title="Help"
							left={() => <List.Icon icon="help-circle-outline" />}
							onPress={() => alert("Coming Soon")}
						/>
						<List.Item
							title="Log out"
							left={() => <List.Icon icon="logout" />}
							onPress={showModal}
						/>
					</List.Section>
				</View>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Account;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		height: Sizes.height,
	},
	footer: {
		height: 40,
		marginBottom: Platform.OS === "ios" ? 20 : 0,
		width: "100%",
	},
	title: {
		fontFamily: "Inter-SemiBold",
		fontStyle: "normal",
		fontSize: 20,
		lineHeight: 24,
		color: "#000000",
		marginVertical: 30,
	},
	subtitle: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		color: "#000000",
		textAlign: "center",
		marginVertical: 5,
		borderWidth: 2,
		borderColor: "#000000",
		flex: 1,
		padding: 10,
	},
	wrapper: {
		width: Sizes.width - 50,
	},
});
