import { Linking, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Button, IconButton } from "react-native-paper";
import { Sizes } from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Confirm from "../Modal/Confirm";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
	"Jan",
	"Feb",
	"March",
	"April",
	"May",
	"June",
	"July",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const NewBooking = ({
	booking,
	handleDelete,
	handleBookingCancel,
	handleDelayModal,
	handleBookingDone,
	handleConfirm,
}) => {
	const navigation = useNavigation();
	const [visible, setVisible] = useState(false);
	const [cancelVisible, setCancelVisible] = useState(false);
	let newDispDate;
	if (booking.delayDate) {
		let newDate = moment(booking.delayDate.seconds * 1000).format(
			"dd , DD MMMM YYYY"
		);
		newDispDate = newDate;
	}
	let prevDate = new Date(booking.date);
	let prevDispDate =
		days[prevDate.getDay()] +
		" , " +
		prevDate.getDate() +
		" " +
		months[parseInt(prevDate.getMonth())] +
		" " +
		prevDate.getFullYear();
	const handleDone = async () => {
		setVisible(false);
		handleBookingDone(
			booking.key,
			booking.uid,
			booking.selectedPro.push_token,
			booking.selectedPro.proId,
			booking.payData.discountedAmount
		);
	};
	const handleCancel = async () => {
		setCancelVisible(false);
		handleBookingCancel(
			booking.key,
			booking.uid,
			booking.selectedPro.push_token,
			booking.payData.choice,
			booking.payData.discountedAmount,
			booking.payData.reference
		);
	};
	return (
		<View style={styles.cardsCover}>
			<Confirm
				visible={visible}
				setVisible={setVisible}
				title={"Are you sure?"}
				subtitle={"Make sure to pay the professional first!"}
				icon={"alert"}
				handleAction={handleDone}
			/>
			<Confirm
				visible={cancelVisible}
				setVisible={setCancelVisible}
				title={"Are you sure?"}
				subtitle={
					"If you cancel. You will be penalized with 5% deduction from your payment"
				}
				icon={"alert"}
				handleAction={handleCancel}
			/>
			<View style={styles.card}>
				<View style={styles.cardTop}>
					<View style={styles.cardTopLeft}>
						<View style={styles.cardTopIcon}>
							<IconButton icon={"ticket"} />
							<Text>Booking Detail</Text>
						</View>
						<View style={{ marginLeft: 20 }}>
							<Text style={{ width: 200 }}>{booking.location.address}</Text>
							<Text>
								{booking.details.bedrooms}Bedroom, {booking.details.bathrooms}{" "}
								Bathroom
							</Text>
							{booking.extras.length > 0 && (
								<Text>
									Extras:{" "}
									{booking.extras.map((extra, i) => (
										<Text key={i}>{extra + " "}</Text>
									))}
								</Text>
							)}
							<Text>{prevDispDate}</Text>
							{newDispDate && <Text>Delay Date: {newDispDate}</Text>}
						</View>
					</View>
					<View style={styles.cardTopRight}>
						<Avatar.Icon icon={"account"} size={50} />
						<Text
							style={{
								textAlign: "center",
							}}
						>
							Cost: R{booking.cost}
						</Text>
						<Text
							style={{
								textAlign: "center",
							}}
						>
							{booking.status}
						</Text>
					</View>
				</View>
				{booking.status == "requested" ? (
					<View style={styles.cardBottom}>
						<Button
							mode="contained"
							buttonColor="gray"
							style={styles.actionBtn}
							onPress={() =>
								navigation.navigate("ConfirmBooking", {
									details: booking.details,
									extras: booking.extras,
									date: booking.date,
									location: booking.location,
									documentId: booking.key,
								})
							}
						>
							Find Pro
						</Button>
						<Button
							mode="contained"
							buttonColor="red"
							style={styles.actionBtn}
							onPress={() => handleDelete(booking.key)}
						>
							Delete
						</Button>
					</View>
				) : booking.status == "assigned" ? (
					<View style={styles.cardBottom}>
						<Button
							mode="contained"
							buttonColor="red"
							style={styles.actionBtn}
							onPress={() =>
								handleDelete(
									booking.key,
									booking.status,
									booking.selectedPro.push_token
								)
							}
						>
							Delete
						</Button>
					</View>
				) : booking.status == "accepted" ? (
					booking.payData ? (
						<View style={styles.cardBottom}>
							<Button
								mode="contained"
								buttonColor="green"
								style={styles.actionBtn}
								onPress={() =>
									handleConfirm(booking.key, booking.selectedPro.push_token)
								}
							>
								Confirm
							</Button>
						</View>
					) : (
						<View style={styles.cardBottom}>
							<Button
								mode="contained"
								buttonColor="rgba(255, 171, 13, 1)"
								style={styles.actionBtn}
								onPress={() =>
									navigation.navigate("Payment", {
										cost: booking.cost,
										commission: booking.commission,
										docId: booking.key,
										pro_token: booking.selectedPro.push_token,
									})
								}
							>
								Pay Now
							</Button>
							<Button
								mode="contained"
								buttonColor="red"
								style={styles.actionBtn}
								onPress={() =>
									handleDelete(
										booking.key,
										booking.status,
										booking.selectedPro.push_token
									)
								}
							>
								Delete
							</Button>
						</View>
					)
				) : booking.status == "confirmed" ? (
					<View style={styles.cardBottom}>
						{!booking.delayDate && (
							<Button
								mode="contained"
								buttonColor="darkblue"
								style={styles.actionBtn}
								onPress={() =>
									handleDelayModal(
										booking.key,
										booking.selectedPro.push_token,
										booking.date
									)
								}
							>
								Delay
							</Button>
						)}
						<Button
							mode="contained"
							buttonColor="green"
							style={styles.actionBtn}
							onPress={() => setVisible(true)}
						>
							Done
						</Button>
					</View>
				) : (
					<View style={styles.cardBottom}>
						<Button
							mode="text"
							icon={"check-circle"}
							buttonColor="white"
							textColor="green"
							onPress={() => {}}
						>
							You confirmed
						</Button>
					</View>
				)}
				{(booking.status == "confirmed" || booking.status == "delayed") && (
					<View style={styles.cardBottom}>
						<Button
							mode="contained"
							buttonColor="red"
							style={styles.actionBtn}
							onPress={() => setCancelVisible(true)}
						>
							Cancel
						</Button>
					</View>
				)}
				{booking.status != "requested" && booking.status != "assigned" && (
					<View style={styles.cardBottom}>
						<IconButton
							onPress={() =>
								navigation.navigate("Chat", {
									proName: booking.selectedPro.proName,
									proToken: booking.selectedPro.push_token,
									proId: booking.selectedPro.proId,
									proPhone: booking.selectedPro.proPhone,
								})
							}
							icon={"chat"}
						/>
						<IconButton
							icon={"phone"}
							onPress={() => {
								Linking.openURL(`tel:+27${booking.selectedPro.proPhone}`);
							}}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

export default NewBooking;

const styles = StyleSheet.create({
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
		borderWidth: 1,
		borderColor: "#000000",
		flex: 1,
		padding: 10,
	},
	wrapper: {
		width: Sizes.width - 50,
		alignSelf: "center",
	},
	subtitleText: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		textAlign: "center",
	},
	cardsCover: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		width: Sizes.width,
		marginVertical: 5,
	},
	card: {
		width: "100%",
		backgroundColor: "#ffffff",
		paddingHorizontal: 10,
		paddingVertical: 10,
		display: "flex",
		flexDirection: "column",
		marginVertical: 5,
	},
	cardTopIcon: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		marginLeft: 5,
	},
	cardTop: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 20,
	},
	cardBottom: {
		display: "flex",
		alignItems: "center",
		gap: 10,
		marginLeft: 20,
		flexDirection: "row",
	},
	cardTopRight: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
		height: 110,
		marginRight: 20,
	},
	actionBtn: {
		borderRadius: 5,
		marginTop: 5,
	},
});
