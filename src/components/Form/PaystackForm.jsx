import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import InputText from "../Input/InputText";
import { Button, TextInput } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";
import { AuthContext } from "../../context/AuthContext";
import { Image } from "react-native";
import PeachMobile from "react-native-peach-mobile";
import axios from "axios";
const PaystackForm = ({ handleSubmit }) => {
	const peachMobileRef = useRef(null);
	const { state } = useContext(AuthContext);
	const [cardDetails, setCardDetails] = useState({
		num: "4084 0840 8408 4081",
		cvv: "408",
		expiry: "10 / 24",
		pin: "",
	});
	const [error, setError] = useState({
		numError: "",
		expiryError: "",
		cvvError: "",
		emailError: "",
	});
	const [payEmail, setPayEmail] = useState("");
	const [checkId, setCheckId] = useState("");
	useEffect(() => {
		state && state.user && setPayEmail(state.user.email);
	}, [state && state.user]);
	useEffect(() => {
		state && state.user && getCheckId();
	}, [state && state.user]);
	const getCheckId = async () => {
		try {
			const checkData = {
				entityId: "8ac7a4ca8b05793a018b098306f402d2",
				amount: "92.00",
				currency: "EUR",
				paymentType: "DB",
			};
			const { data } = await axios.post(
				"https://eu-test.oppwa.com/v1/checkouts",
				checkData,
				{
					headers: {
						Authorization:
							"Bearer OGFjN2E0Yzc4YjA1NzEzZDAxOGIwOTgyYWIxYzAzMGR8ZXdrQks5V3JFZGtoOVJBbQ==",
					},
				}
			);
			console.log(data);
			if (data.id) {
				setCheckId(data.id);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handleChange = (name, value) => {
		let trimmedValue;
		if (name === "cvv") {
			trimmedValue = value.replace(/[^0-9]/g, "");
			setCardDetails({
				...cardDetails,
				cvv: trimmedValue,
			});
			if (trimmedValue.length < 3) {
				setError({ ...error, cvvError: "Invalid CVV" });
				return;
			} else {
				setError({ ...error, cvvError: "" });
				return;
			}
		}
		if (name === "payEmail") {
			setPayEmail(value);
		}
		if (name === "cardNumber") {
			trimmedValue = value.replace(/[^0-9]/g, "");
			if (trimmedValue.length > 16) {
				return;
			}
			if (trimmedValue.length < 16) {
				setError({ ...error, numError: "Incomplete numbers" });
			} else {
				setError({ ...error, numError: "" });
			}
			if (trimmedValue.length > 4) {
				var results = trimmedValue.match(/.{1,4}/g);
				var final_cc_str = results.join(" ");
				setCardDetails({
					...cardDetails,
					num: final_cc_str,
				});
			} else {
				setCardDetails({
					...cardDetails,
					num: trimmedValue,
				});
			}
		}
		if (name === "expiry") {
			trimmedValue = value.replace(/[^0-9]/g, "");
			if (trimmedValue.length > 4) {
				return;
			}
			if (trimmedValue.length < 4) {
				setError({ ...error, expiryError: "Invalid Expiry" });
			} else {
				setError({ ...error, expiryError: "" });
			}
			if (trimmedValue.length >= 3) {
				setCardDetails({
					...cardDetails,
					expiry:
						trimmedValue.substring(0, 2) + " / " + trimmedValue.substring(2),
				});
			} else {
				setCardDetails({ ...cardDetails, expiry: trimmedValue });
			}
		}
	};
	return (
		// <View>
		// 	<InputText
		// 		title={"Enter payment email *"}
		// 		name={"payEmail"}
		// 		handleChange={handleChange}
		// 		value={payEmail}
		// 	/>
		// 	{error.emailError != "" && (
		// 		<Text
		// 			style={{
		// 				color: "red",
		// 				textAlign: "center",
		// 			}}
		// 		>
		// 			{error.emailError}
		// 		</Text>
		// 	)}
		// 	<InputText
		// 		title={"Enter card number *"}
		// 		name={"cardNumber"}
		// 		handleChange={handleChange}
		// 		value={cardDetails.num}
		// 	/>
		// 	{error.numError != "" && (
		// 		<Text
		// 			style={{
		// 				color: "red",
		// 				textAlign: "center",
		// 			}}
		// 		>
		// 			{error.numError}
		// 		</Text>
		// 	)}
		// 	<View
		// 		style={{
		// 			display: "flex",
		// 			flexDirection: "row",
		// 			justifyContent: "space-between",
		// 		}}
		// 	>
		// 		<View>
		// 			<TextInput
		// 				label={"Expiry *"}
		// 				mode="outlined"
		// 				style={{
		// 					backgroundColor: "#ffffff",
		// 					width: Sizes.width / 4,
		// 					marginVertical: 10,
		// 					fontSize: 12,
		// 				}}
		// 				outlineColor="#000000"
		// 				activeOutlineColor={"#000000"}
		// 				selectionColor={colors.desc}
		// 				onChangeText={(text) => handleChange("expiry", text)}
		// 				value={cardDetails.expiry}
		// 				keyboardType={"number-pad"}
		// 				// maxLength={2}
		// 			/>
		// 			{error.expiryError != "" && (
		// 				<Text
		// 					style={{
		// 						color: "red",
		// 						textAlign: "center",
		// 					}}
		// 				>
		// 					{error.expiryError}
		// 				</Text>
		// 			)}
		// 		</View>
		// 		<View>
		// 			<TextInput
		// 				label={"cvv *"}
		// 				mode="outlined"
		// 				style={{
		// 					backgroundColor: "#ffffff",
		// 					width: Sizes.width / 4,
		// 					marginVertical: 10,
		// 					fontSize: 12,
		// 				}}
		// 				outlineColor="#000000"
		// 				activeOutlineColor={"#000000"}
		// 				selectionColor={colors.desc}
		// 				onChangeText={(text) => handleChange("cvv", text)}
		// 				value={cardDetails.cvv}
		// 				keyboardType={"number-pad"}
		// 				maxLength={3}
		// 			/>
		// 			{error.cvvError != "" && (
		// 				<Text
		// 					style={{
		// 						color: "red",
		// 						textAlign: "center",
		// 					}}
		// 				>
		// 					{error.cvvError}
		// 				</Text>
		// 			)}
		// 		</View>
		// 	</View>
		// 	<Button
		// 		mode="contained"
		// 		buttonColor="#000000"
		// 		textColor="#ffffff"
		// 		style={{
		// 			borderRadius: 0,
		// 			height: 55,
		// 			display: "flex",
		// 			justifyContent: "center",
		// 			alignItems: "center",
		// 			marginVertical: 10,
		// 		}}
		// 		onPress={() => handleSubmit(cardDetails, payEmail, error)}
		// 	>
		// 		Pay Now
		// 	</Button>
		// </View>
		<View>
			{checkId === "" ? (
				<Text>loading</Text>
			) : (
				<PeachMobile
					mode="test"
					urlScheme="com.example.cleansing.payments"
					cardHolder={"Ahmad"}
					cardNumber={cardDetails.num}
					cardExpiryYear={24}
					cardExpiryMonth={12}
					cardCVV={cardDetails.cvv}
					checkoutID={checkId}
					ref={peachMobileRef}
				/>
			)}
		</View>
	);
};

export default PaystackForm;

const styles = StyleSheet.create({});
