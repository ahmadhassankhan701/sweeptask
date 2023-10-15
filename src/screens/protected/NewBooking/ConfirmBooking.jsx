import { StyleSheet, Text, View, Image } from "react-native";
import { ActivityIndicator, Button, Divider } from "react-native-paper";
import React, { useContext, useState, useEffect } from "react";
import { Sizes } from "../../../utils/theme";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../../firebase";
import { ScrollView } from "react-native";
import haversineDistance from "haversine-distance";
import Slider from "@react-native-community/slider";
import ProList from "../../../components/Card/ProList";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";

const ConfirmBooking = ({ route, navigation }) => {
	const { state } = useContext(AuthContext);
	const { details, extras, date, location, documentId } = route.params;
	const [range, setRange] = useState("");
	const [pros, setPros] = useState(null);
	const [selectedPro, setSelectedPro] = useState(null);
	const [totalCost, setTotalCost] = useState({
		cost: 0,
		commission: 0,
	});
	const [loading, setLoading] = useState(false);
	const [orgLoading, setOrgLoading] = useState(false);
	useEffect(() => {
		if (state && state.user) {
			getPro(5);
			getPricing(state.user.suburb, details.bedrooms, details.bathrooms);
		}
	}, [state && state.user]);
	const getPricing = async (suburb, bedrooms, bathrooms) => {
		const pricingRef = doc(db, "Pricing", suburb);
		const pricingSnap = await getDoc(pricingRef);
		if (pricingSnap.exists()) {
			const pricingArray = pricingSnap.data().pricing;
			pricingArray.map((item) => {
				if (item.bed == bedrooms && item.bath == bathrooms) {
					setTotalCost({
						cost: item.price,
						commission: item.commission,
					});
				}
			});
		}
	};
	const handleBooking = async () => {
		if (selectedPro === null) {
			alert("Please select a professional");
			return;
		}
		try {
			setLoading(true);
			const bookingData = {
				details,
				extras,
				date,
				location,
				cost: totalCost.cost,
				commission: totalCost.commission,
				selectedPro,
				status: "assigned",
				uid: state.user.uid,
				push_token: state.user.push_token,
				createdAt: serverTimestamp(),
			};
			const bookRef = collection(db, "Bookings");
			await addDoc(bookRef, bookingData);
			await sendNotification(
				selectedPro.push_token,
				"Cleaning Request",
				"Good News. You have received a Cleaning Request. Take action now!"
			);
			setLoading(false);
			alert("Success. Once professional takes action you will be notified!");
			navigation.navigate("Booking");
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleProAssign = async () => {
		if (selectedPro === null) {
			alert("Please select a professional");
			return;
		}
		try {
			setLoading(true);
			const newBookingData = {
				selectedPro,
				status: "assigned",
				createdAt: serverTimestamp(),
			};
			const bookRef = doc(db, "Bookings", documentId);
			await updateDoc(bookRef, newBookingData);
			await sendNotification(
				selectedPro.push_token,
				"Cleaning Request",
				"Good News. You have received a Cleaning Request. Take action now!"
			);
			setLoading(false);
			alert("Success. Once professional takes action you will be notified!");
			navigation.navigate("Booking");
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const getPro = async (range) => {
		setOrgLoading(true);
		const pros = query(
			collection(db, "Users"),
			where("role", "==", "professional"),
			where("active", "==", true),
			orderBy("createdAt", "asc")
		);
		const items = [];
		getDocs(pros)
			.then((querySnapshot) => {
				if (querySnapshot.size == 0) {
					setPros(null);
					setOrgLoading(false);
					return;
				}
				querySnapshot.forEach((doc) => {
					items.push({ key: doc.id, ...doc.data() });
				});
				filterByRange(items, range);
			})
			.catch((err) => {
				setOrgLoading(false);
				console.log(err);
			});
	};
	const filterByRange = async (items, range) => {
		if (items) {
			let kmRange = range * 1000;
			const filteredPros = items.filter((item) => {
				let distance = haversineDistance(
					{
						latitude: item.location.lat,
						longitude: item.location.lng,
					},
					{
						latitude: location.currentLocation.lat,
						longitude: location.currentLocation.lng,
					}
				);
				if (distance <= kmRange) {
					return true;
				}
			});
			if (Object.keys(filteredPros).length == 0) {
				setPros(null);
				setOrgLoading(false);
				return;
			} else {
				setPros(filteredPros);
			}
			setOrgLoading(false);
		}
	};
	return (
		<View style={styles.container}>
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
						source={require("../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}
			<View style={styles.wrapper}>
				<View>
					<View style={{ marginVertical: 10 }}>
						<Text style={styles.title}>Book confirmation</Text>
					</View>
					<Text style={styles.confirm}>{location.address}</Text>
					<Text style={styles.confirm}>
						{details.bedrooms}Bedroom, {details.bathrooms} Bathroom
					</Text>
					<Text style={styles.confirm}>{date.toLocaleString()}</Text>
				</View>
				<Divider
					style={{
						marginVertical: 20,
						backgroundColor: "#B7B7B7",
						borderWidth: 0.3,
						borderColor: "#B7B7B7",
					}}
				/>
				<View>
					<View>
						<Text
							style={{
								color: "#000",
								marginBottom: 5,
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
								borderRadius: 0,
							}}
						>
							<Text style={{ color: "#fff", fontSize: 15 }}>5</Text>
							<Slider
								style={{ width: 250, height: 50 }}
								minimumValue={5}
								maximumValue={20}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#FFFFFF"
								step={2}
								onSlidingComplete={(value) => {
									setRange(value);
									getPro(value);
								}}
							/>
							<Text style={{ color: "#fff", fontSize: 15 }}>
								{range == "" ? 20 : range}
							</Text>
						</View>
					</View>
					<View
						style={{
							height: 250,
							marginTop: 5,
						}}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							{orgLoading ? (
								<ActivityIndicator
									size={50}
									animating={orgLoading}
									color={"#000"}
								/>
							) : pros ? (
								<ProList
									pros={pros}
									selectedPro={selectedPro}
									setSelectedPro={setSelectedPro}
								/>
							) : (
								<Text
									style={{
										color: "#000",
										textAlign: "center",
										fontSize: 14,
									}}
								>
									No professional found. There may be no professional or active
									currently.You may ask admin!
								</Text>
							)}
						</ScrollView>
					</View>
					<Divider
						style={{
							marginVertical: 20,
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
					<View
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexDirection: "row",
							gap: 10,
							width: Sizes.width - 50,
						}}
					>
						<View>
							<Text style={styles.title}>Total Costs</Text>
							<Text style={styles.confirm}>R {totalCost.cost}</Text>
						</View>
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
							}}
							onPress={documentId ? handleProAssign : handleBooking}
						>
							{documentId ? "Assign" : "Book"}
						</Button>
					</View>
				</View>
			</View>
		</View>
	);
};

export default ConfirmBooking;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	wrapper: {
		marginVertical: 10,
		width: Sizes.width - 50,
	},
	title: {
		fontWeight: "700",
		fontSize: 16,
		lineHeight: 19,
	},
	confirm: {
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 19,
	},
});
