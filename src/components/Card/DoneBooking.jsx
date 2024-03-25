import { StyleSheet, Text, View } from "react-native";
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
const DoneBooking = ({ booking }) => {
	const navigation = useNavigation();
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
	return (
		<View style={styles.cardsCover}>
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
							<Text>
								Extras:{" "}
								{booking.extras.map((extra, i) => (
									<Text key={i}>{extra + " "}</Text>
								))}
							</Text>
							<Text>{prevDispDate}</Text>
							{newDispDate && <Text>New Date: {newDispDate}</Text>}
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
				<Button
					onPress={() =>
						navigation.navigate("Feedback", {
							docId: booking.key,
							proId: booking.selectedPro.proId,
						})
					}
				>
					Feedback
				</Button>
			</View>
		</View>
	);
};

export default DoneBooking;

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
	},
});
