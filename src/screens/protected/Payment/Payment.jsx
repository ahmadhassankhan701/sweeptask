import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, RadioButton } from "react-native-paper";
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
import { Paystack, paystackProps } from "react-native-paystack-webview";
// import nanoid from "nanoid";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
const Payment = ({ route, navigation }) => {
	const { cost, commission, docId, pro_token } = route.params;
	const { state } = useContext(AuthContext);
	const [choice, setChoice] = useState("visa");
	const [totalCost, setTotalCost] = useState(cost);
	const [promoDetails, setPromoDetails] = useState(null);
	const [promo, setPromo] = useState("");
	const [appliedPromo, setAppliedPromo] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
	const [loading, setLoading] = useState(false);

	const paystackWebViewRef = useRef(paystackProps.PayStackRef);

	useEffect(() => {
		state && state.user && getPromoDetails();
	}, [state && state.user]);
	const getPromoDetails = async () => {
		setLoading(true);
		const docRef = doc(db, `Users`, state.user.uid);
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
		setPromo(value);
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
			alert("Promo code applied");
		} else {
			alert("No such promo code");
		}
	};
	const generateRef = (length) => {
		var a =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
				""
			);
		var b = [];
		for (var i = 0; i < length; i++) {
			var j = (Math.random() * (a.length - 1)).toFixed(0);
			b[i] = a[j];
		}
		return b.join("");
	};
	const handleCashBooking = async () => {
		const payData = {
			amount: cost,
			commission,
			discountedAmount: totalCost,
			choice: choice,
			appliedPromo: appliedPromo,
			customerPaid: false,
		};
		const payDataRecord = {
			amount: cost,
			commission,
			discountedAmount: totalCost,
			choice: choice,
			appliedPromo: appliedPromo,
			customerPaid: false,
			uid: state.user.uid,
			docId: docId,
		};
		const updateData = { status: "confirmed", payData };
		const userRef = doc(db, `Users`, state.user.uid);
		const docRef = doc(db, `Bookings`, docId);
		const payRef = doc(db, "Payments", docId);
		try {
			setActionLoading(true);
			await updateDoc(docRef, updateData);
			await setDoc(payRef, payDataRecord);
			if (appliedPromo) {
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
			navigation.navigate("Booking");
		} catch (error) {
			setActionLoading(false);
			console.log(error);
			alert("Something went wrong");
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
						source={require("../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}
			{loading ? (
				<ActivityIndicator size={50} style={{ marginTop: 50 }} />
			) : (
				<View style={styles.wrapper}>
					<Text style={styles.title}>Payment details</Text>
					<View>
						<RadioButton.Group
							onValueChange={(newValue) => setChoice(newValue)}
							value={choice}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									marginTop: 20,
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
									<Image source={require("../../../assets/visa.png")} />
									<Text
										style={{
											fontWeight: "600",
											fontSize: 20,
										}}
									>
										....
									</Text>
									<Text>1967</Text>
								</View>
								<RadioButton value="visa" color="#000000" />
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									marginTop: 10,
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
								<RadioButton value="cash" color="#000000" />
							</View>
						</RadioButton.Group>
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
							</View>
							<Button
								mode="contained"
								buttonColor="#000000"
								textColor="#ffffff"
								style={{
									borderRadius: 0,
									width: Sizes.width - 50,
									height: 55,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								onPress={handlePromo}
							>
								Apply Promo code
							</Button>
						</View>
					)}
					<Paystack
						ref={paystackWebViewRef}
						paystackKey="pk_test_05df482be1271f8b2be1b1aeb9faa56f413b3756"
						billingEmail="trotric@cleantask.co.za"
						billingName="Trotric Mabuso"
						// channels={JSON.stringify(["card", "bank"])}
						amount={"100.00"}
						currency="ZAR"
						// refNumber={"ref-" + Math.floor(Math.random() * 1000000000 + 1)}
						onCancel={(e) => {
							// handle response here
							alert("cancelled");
						}}
						onSuccess={(res) => {
							// handle response here
							alert("success");
							console.log(res);
						}}
					/>
					{choice === "visa" ? (
						<View>
							<TouchableOpacity
								onPress={() => paystackWebViewRef.current.startTransaction()}
							>
								<View>
									<LinearGradient
										colors={["#F9F6EE", "#EDEADE"]}
										style={{
											marginTop: 10,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "row",
											paddingVertical: 10,
										}}
									>
										<Image
											source={require("../../../assets/paystack_btn.png")}
											alt="paystack"
											style={{ width: 150, height: 40 }}
										/>
									</LinearGradient>
								</View>
							</TouchableOpacity>
						</View>
					) : (
						<Button
							mode="contained"
							buttonColor="#000000"
							textColor="#ffffff"
							style={{
								borderRadius: 0,
								height: 55,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 20,
							}}
							onPress={handleCashBooking}
						>
							Book (R{totalCost})
						</Button>
					)}
				</View>
			)}
		</View>
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
	},
	title: {
		marginTop: 20,
	},
});
