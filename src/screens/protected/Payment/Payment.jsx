import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Modal,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import InputText from "../../../components/Input/InputText";
import { Sizes } from "../../../utils/theme";
import {
	deleteField,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import {
	createCheckout,
	createReCheckout,
	verifyTransaction,
} from "../../../utils/Helpers/PayFunc";
import queryString from "query-string";
const Payment = ({ route, navigation }) => {
	const { cost, commission, docId, pro_token } = route.params;
	const { state } = useContext(AuthContext);
	const [choice, setChoice] = useState("cash");
	const [totalCost, setTotalCost] = useState(cost);
	const [promoDetails, setPromoDetails] = useState(null);
	const [cards, setCards] = useState(null);
	const [promo, setPromo] = useState("");
	const [authCode, setAuthCode] = useState("");
	const [payEmail, setPayEmail] = useState("");
	const [appliedPromo, setAppliedPromo] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [checkoutUrl, setCheckoutUrl] = useState("");
	const webViewRef = useRef(null);
	const callbackUrl = "https://example.com";
	useEffect(() => {
		if (state && state.user) {
			getPromoDetails();
			getCardDetails();
		}
	}, [state && state.user]);
	const getCardDetails = async () => {
		setLoading(true);
		const docRef = doc(db, "Accounts", state.user.uid);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists() && docSnap.data().cards) {
					const cards = docSnap.data().cards;
					if (cards && cards.length > 0) {
						setCards(cards);
					}
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	const getPromoDetails = async () => {
		setLoading(true);
		const docRef = doc(db, "Users", state.user.uid);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists() && docSnap.data().promo) {
					setPromoDetails(docSnap.data().promo);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	const handleChange = (name, value) => {
		if (name === "promo") {
			setPromo(value);
		}
		if (name === "payEmail") {
			setPayEmail(value);
		}
	};
	const handlePromo = () => {
		if (promo === "") {
			alert("Please enter promo code");
			return;
		}
		if (promoDetails.promo === promo) {
			const calcCost = cost - cost * (parseInt(promoDetails.promoValue) / 100);
			setTotalCost(calcCost);
			setPromoDetails(null);
			setAppliedPromo(promo);
			alert("Promo code applied");
		} else {
			alert("No such promo code");
		}
	};
	const handleMakeBooking = () => {
		if (choice === "cash") {
			handleCashBooking();
		} else if (choice === "visa") {
			handleReusable(authCode);
		} else {
			handlePaystackPayment();
		}
	};
	const handleCashBooking = async () => {
		const payData = {
			amount: cost,
			commission,
			discountedAmount: totalCost,
			choice: choice,
			appliedPromo: appliedPromo,
		};
		handleDataSaving(payData);
	};
	const handleDataSaving = async (payData, cardData) => {
		const updateData = { status: "confirmed", payData };
		const userRef = doc(db, `Users`, state.user.uid);
		const userCardRef = doc(db, `Accounts`, state.user.uid);
		const docRef = doc(db, `Bookings`, docId);
		try {
			setActionLoading(true);
			if (choice === "new") {
				const docSnap = await getDoc(userCardRef);
				if (docSnap.exists()) {
					const cards = docSnap.data().cards;
					if (cards && cards.length > 0) {
						const cardIndex = cards.findIndex(
							(card) => card.authorization_code === cardData.authorization_code
						);
						if (cardIndex === -1) {
							await updateDoc(userCardRef, {
								cards: [...cards, cardData],
							});
						}
					} else {
						await updateDoc(userCardRef, {
							cards: [cardData],
						});
					}
				} else {
					await setDoc(userCardRef, {
						cards: [cardData],
					});
				}
			}
			await updateDoc(docRef, updateData);
			if (appliedPromo !== "") {
				await updateDoc(userRef, {
					promo: deleteField(),
				});
			}
			await sendNotification(
				pro_token,
				"Request confirmed",
				"Hurray!!! Customer has confirmed cleaning request"
			);
			setActionLoading(false);
			navigation.navigate("Success", {
				title: "Payment Successful",
				desc: "Congratulations! You have confimred the booking. Professional will be informed. Happy cleaning",
				to: "Booking",
			});
		} catch (error) {
			setActionLoading(false);
			console.log(error);
			alert("Something went wrong");
		}
	};
	const handleReusable = async (auth_code) => {
		if (payEmail === "") {
			alert("Please enter billing email");
			return;
		}
		try {
			const data = await createReCheckout(
				payEmail,
				totalCost,
				"ZAR",
				auth_code
			);
			if (data && data.authorization) {
				const payData = {
					id: data.id,
					reference: data.reference,
					amount: cost,
					commission,
					discountedAmount: totalCost,
					choice: choice,
					appliedPromo: appliedPromo,
				};
				handleDataSaving(payData);
			} else {
				alert("Transaction could not be placed. Try again!!!");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handlePaystackPayment = async () => {
		if (payEmail === "") {
			alert("Please enter billing email");
			return;
		}
		try {
			const data = await createCheckout(
				payEmail,
				totalCost,
				"ZAR",
				callbackUrl
			);
			if (data && data.authorization_url) {
				setCheckoutUrl(data.authorization_url);
			} else {
				alert("Could not create checkout");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const onUrlChange = (webviewState) => {
		const { url } = webviewState;

		if (!url) return;
		if (url.includes("https://standard.paystack.co/close")) {
			setCheckoutUrl("");
			return;
		}
		if (url.includes(callbackUrl)) {
			const urlValues = queryString.parseUrl(url);
			if (urlValues.query && urlValues.query.reference) {
				onReturnPress(urlValues.query.reference);
			} else {
				alert("Payment could not be processed");
			}
			setCheckoutUrl("");
		}
	};
	const onReturnPress = async (reference) => {
		const data = await verifyTransaction(reference);
		if (data && data.authorization) {
			const cardData = data.authorization;
			cardData.email = data.customer.email;
			const payData = {
				id: data.id,
				reference: data.reference,
				amount: cost,
				commission,
				discountedAmount: totalCost,
				choice: choice,
				appliedPromo: appliedPromo,
			};
			handleDataSaving(payData, cardData);
		} else {
			alert("Transaction could not be verified");
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
		>
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
						source={require("../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<ScrollView>
				<View style={styles.container}>
					{/* <Text>{JSON.stringify(state, null, 4)}</Text> */}

					{loading ? (
						<ActivityIndicator size={50} style={{ marginTop: 50 }} />
					) : (
						<View style={styles.wrapper}>
							<Text style={styles.title}>Payment details</Text>
							<View>
								<TouchableOpacity
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: 20,
										borderRadius: 10,
										backgroundColor: "white",
										paddingLeft: 10,
									}}
									onPress={() => {
										setAuthCode("");
										setChoice("cash");
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
										<Image source={require("../../../assets/cash.png")} />
										<Text>Cash</Text>
									</View>
									{choice === "cash" ? (
										<IconButton icon={"radiobox-marked"} />
									) : (
										<IconButton icon={"radiobox-blank"} />
									)}
								</TouchableOpacity>
								{cards &&
									cards.length > 0 &&
									cards.map((card) => (
										<TouchableOpacity
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-between",
												marginTop: 20,
												borderRadius: 10,
												backgroundColor: "white",
												paddingLeft: 10,
											}}
											onPress={() => {
												setAuthCode(card.authorization_code);
												setPayEmail(card.email);
												setChoice("visa");
											}}
											key={card.authorization_code}
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
													source={require("../../../assets/credit_card.png")}
													style={{ width: 30, height: 20 }}
												/>
												<Text
													style={{
														fontWeight: "600",
														fontSize: 20,
													}}
												>
													....
												</Text>
												<Text>{card.last4}</Text>
											</View>
											{choice === "visa" &&
											authCode === card.authorization_code ? (
												<IconButton icon={"radiobox-marked"} />
											) : (
												<IconButton icon={"radiobox-blank"} />
											)}
										</TouchableOpacity>
									))}

								<TouchableOpacity
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: 20,
										borderRadius: 10,
										backgroundColor: "white",
										paddingLeft: 10,
									}}
									onPress={() => {
										setAuthCode("");
										setPayEmail(state.user.email);
										setChoice("new");
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
											source={require("../../../assets/new_card.png")}
											style={{ width: 30, height: 20 }}
										/>
										<Text>New Card</Text>
									</View>
									{choice === "new" ? (
										<IconButton icon={"radiobox-marked"} />
									) : (
										<IconButton icon={"radiobox-blank"} />
									)}
								</TouchableOpacity>
							</View>

							{promoDetails != null && (
								<View
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<View style={{ marginVertical: 10 }}>
										<InputText
											title={"Enter promo code"}
											name={"promo"}
											handleChange={handleChange}
											value={promo}
										/>
										<Text>
											Don't remember.{" "}
											<Text
												style={{ color: "#000080" }}
												onPress={() => setPromo(promoDetails.promo)}
											>
												Let us Fill
											</Text>{" "}
										</Text>
										<TouchableOpacity onPress={handlePromo}>
											<LinearGradient
												colors={["white", "gray"]}
												style={{
													marginTop: 10,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													flexDirection: "row",
													paddingVertical: 10,
												}}
											>
												<Text
													style={{
														color: "#253b80",
														fontStyle: "normal",
														fontSize: 17,
														fontWeight: "bold",
													}}
												>
													Apply{" "}
												</Text>
												<Text
													style={{
														color: "#179bd7",
														fontStyle: "italic",
														fontSize: 17,
														fontWeight: "bold",
													}}
												>
													Promo
												</Text>
											</LinearGradient>
										</TouchableOpacity>
									</View>
								</View>
							)}
							{(choice === "visa" || choice === "new") && (
								<InputText
									title={"Billing Email"}
									name={"payEmail"}
									handleChange={handleChange}
									value={payEmail}
								/>
							)}
							<TouchableOpacity
								style={{
									marginTop: 20,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "row",
									paddingVertical: 10,
									backgroundColor: "#000000",
								}}
								onPress={handleMakeBooking}
							>
								<Text
									style={{
										color: "#fff",
										fontStyle: "normal",
										fontSize: 17,
										fontWeight: "bold",
									}}
								>
									Make Booking{" "}
								</Text>
								<Text
									style={{
										color: "#fff",
										fontStyle: "italic",
										fontSize: 17,
										fontWeight: "bold",
									}}
								>
									(R{totalCost})
								</Text>
							</TouchableOpacity>
							<Modal visible={!!checkoutUrl}>
								<Button
									onPress={() => setCheckoutUrl("")}
									mode="text"
									icon={"close-circle"}
								>
									Close
								</Button>
								<View style={{ flex: 1 }}>
									<WebView
										ref={webViewRef}
										source={{ uri: checkoutUrl }}
										onNavigationStateChange={onUrlChange}
										onMessage={(event) => {
											console.log(event.nativeEvent.data);
										}}
									/>
								</View>
							</Modal>
						</View>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Payment;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
		paddingBottom: 20,
	},
	title: {
		marginTop: 20,
	},
});
