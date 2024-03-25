import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Image,
	Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Sizes } from "../../utils/theme";
import Footer from "../../components/Footer";
import { IconButton } from "react-native-paper";
import {
	and,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	or,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import NewBooking from "../../components/Card/NewBooking";
import { sendNotification } from "../../utils/Helpers/NotifyConfig";
import DelayModal from "../../components/Modal/DelayModal";
import { addDays } from "date-fns";
import Toast from "react-native-toast-message";
import DoneBooking from "../../components/Card/DoneBooking";
import { handleRefund } from "../../utils/Helpers/PayFunc";
const Booking = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [mode, setMode] = useState("upcoming");
	const [visible, setVisible] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const [userWallet, setUserWallet] = useState(null);
	const [delay, setDelay] = useState({
		docId: "",
		date: new Date(),
		push_token: "",
	});
	const [bookings, setBookings] = useState([]);
	useEffect(() => {
		state && state.user && handleUpcoming();
	}, [state && state.user]);
	const handleHistory = async () => {
		setMode("history");
		setActionLoading(true);
		const bookRef = query(
			collection(db, "Bookings"),
			where("uid", "==", state.user.uid),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setActionLoading(false);
				setBookings([]);
				return;
			} else {
				let items = [];
				querySnapshot.docs.map((doc) => {
					if (doc.data().status == "done" || doc.data().status == "cancelled") {
						items.push({
							key: doc.id,
							...doc.data(),
						});
					}
				});
				setBookings(items);
				setActionLoading(false);
			}
		});
	};
	const handleUpcoming = async () => {
		setMode("upcoming");
		setActionLoading(true);
		const bookRef = query(
			collection(db, "Bookings"),
			where("uid", "==", state.user.uid),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setActionLoading(false);
				setBookings([]);
				return;
			} else {
				let items = [];
				querySnapshot.docs.map((doc) => {
					if (doc.data().status != "done" && doc.data().status != "cancelled") {
						items.push({
							key: doc.id,
							...doc.data(),
						});
					}
				});
				setBookings(items);
				setActionLoading(false);
			}
		});
	};
	const handleDelete = async (docId, status, proToken) => {
		try {
			const docRef = doc(db, "Bookings", docId);
			await deleteDoc(docRef);
			if (status == "assigned" || status == "accepted") {
				await sendNotification(
					proToken,
					"Booking Deleted",
					"Sad News. Customer has deleted the booking!"
				);
			}
			alert("Booking deleted");
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleConfirm = async (docId, proToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			await updateDoc(docRef, {
				status: "confirmed",
			});
			await sendNotification(
				proToken,
				"Booking Confirmed!",
				"Hurray! Customer has confirmed the booking"
			);
			setActionLoading(false);
			alert("You confirmed the Booking");
		} catch (error) {
			setActionLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleDelayModal = async (docId, pToken, prevDate) => {
		setDelay({
			...delay,
			docId: docId,
			push_token: pToken,
			prevDate,
		});
		setVisible(true);
	};
	const handleDelay = async (newDate) => {
		try {
			const docRef = doc(db, "Bookings", delay.docId);
			await updateDoc(docRef, {
				status: "delayed",
				delayDate: newDate,
			});
			await sendNotification(
				delay.push_token,
				"Booking Delay Request!",
				"Customer has requested to delay the booking"
			);
			setVisible(false);
			alert("Booking Delay Request Sent");
		} catch (error) {
			console.log(error);
			setVisible(false);
			alert("Something went wrong");
		}
	};
	const handleBookingCancel = async (
		docId,
		customerId,
		proToken,
		payChoice,
		discountedAmount,
		transaction_id
	) => {
		try {
			setActionLoading(true);
			const userWalletRef = doc(db, `Users`, customerId);
			const bookingRef = doc(db, `Bookings`, docId);
			const userWalletSnap = await getDoc(userWalletRef);
			const userWalletData = userWalletSnap.data().wallet;
			let wallet;
			let bookingBody;
			let penalty = discountedAmount * 0.05;
			if (payChoice === "cash") {
				if (userWalletData) {
					await updateDoc(userWalletRef, {
						"wallet.totalPenalty": userWalletData.totalPenalty + penalty,
					});
				} else {
					wallet = {
						totalSpent: 0,
						totalPenalty: penalty,
						penaltyPaid: 0,
						refundAmount: 0,
						refundAmountReceived: 0,
					};
					await updateDoc(userWalletRef, { wallet });
				}
				bookingBody = {
					status: "cancelled",
				};
			} else {
				if (userWalletData) {
					await updateDoc(userWalletRef, {
						"wallet.totalPenalty": userWalletData.totalPenalty + penalty,
						"wallet.refundAmount":
							userWalletData.refundAmount + discountedAmount,
					});
				} else {
					wallet = {
						totalSpent: 0,
						totalPenalty: penalty,
						penaltyPaid: 0,
						refundAmount: discountedAmount,
						refundAmountReceived: 0,
					};
					await updateDoc(userWalletRef, { wallet });
				}
				bookingBody = {
					status: "cancelled",
					refundStatus: {
						status: "pending",
						ref: transaction_id,
					},
				};
			}
			await updateDoc(bookingRef, bookingBody);
			await sendNotification(
				proToken,
				"Booking Cancelled",
				"Sad News. Customer has cancelled the Booking!"
			);
			setActionLoading(false);
			Toast.show({
				type: "error",
				position: "top",
				text1: "Booking has been Cancelled",
				visibilityTime: 2000,
				autoHide: true,
			});
		} catch (error) {
			setActionLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleBookingDone = async (
		docId,
		customerId,
		proToken,
		discountedAmount
	) => {
		try {
			setActionLoading(true);
			const userWalletRef = doc(db, `Users`, customerId);
			const bookingRef = doc(db, `Bookings`, docId);
			const userWalletSnap = await getDoc(userWalletRef);
			const userWalletData = userWalletSnap.data().wallet;
			let wallet;
			if (userWalletData) {
				await updateDoc(userWalletRef, {
					"wallet.totalSpent": userWalletData.totalSpent + discountedAmount,
				});
			} else {
				wallet = {
					totalSpent: discountedAmount,
					totalPenalty: 0,
					penaltyPaid: 0,
					refundAmount: 0,
					refundAmountReceived: 0,
				};
				await updateDoc(userWalletRef, { wallet });
			}
			await updateDoc(bookingRef, { status: "pending" });
			await sendNotification(
				proToken,
				"Customer Confirmed",
				"Congratulations. Customer confirmed booking completion. Waiting for your confirmation!"
			);
			setActionLoading(false);
			navigation.navigate("Feedback", { docId });
		} catch (error) {
			setActionLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};

	return (
		<View style={styles.container}>
			<Toast />
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
			{/* <Text>{JSON.stringify(bookings, null, 4)}</Text> */}
			<DelayModal
				visible={visible}
				setVisible={setVisible}
				delay={delay}
				handleDelay={handleDelay}
			/>
			<View
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "row",
					width: Sizes.width - 20,
					marginTop: 40,
				}}
			>
				<Text style={styles.title}>My Bookings</Text>
				<IconButton
					size={30}
					icon={"plus-box-outline"}
					onPress={() => navigation.navigate("NewBooking")}
				/>
			</View>
			<View
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "center",
					width: Sizes.width - 30,
				}}
			>
				<TouchableOpacity
					style={
						mode === "history"
							? [
									styles.subtitle,
									{
										backgroundColor: "green",
									},
							  ]
							: styles.subtitle
					}
					onPress={handleHistory}
				>
					<Text style={styles.subtitleText}>History</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						mode === "upcoming"
							? [
									styles.subtitle,
									{
										backgroundColor: "green",
									},
							  ]
							: styles.subtitle
					}
					onPress={handleUpcoming}
				>
					<Text style={styles.subtitleText}>Upcoming</Text>
				</TouchableOpacity>
			</View>

			<View style={{ flex: 1, paddingVertical: 10 }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					{Object.keys(bookings).length > 0 ? (
						mode === "upcoming" ? (
							bookings.map((booking, i) => (
								<NewBooking
									booking={booking}
									key={i}
									handleDelete={handleDelete}
									handleBookingCancel={handleBookingCancel}
									handleDelayModal={handleDelayModal}
									handleBookingDone={handleBookingDone}
									handleConfirm={handleConfirm}
								/>
							))
						) : (
							bookings.map((booking, i) => (
								<DoneBooking booking={booking} key={i} />
							))
						)
					) : (
						<View
							style={{
								height: Sizes.height - 300,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text style={{ textAlign: "center" }}>No bookings found</Text>
						</View>
					)}
				</ScrollView>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Booking;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		height: Sizes.height,
		justifyContent: "space-between",
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
		fontFamily: "Inter-SemiBold",
		fontStyle: "normal",
		fontSize: 20,
		lineHeight: 24,
		color: "#000000",
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
	},
	card: {
		width: "100%",
		backgroundColor: "#ffffff",
		paddingHorizontal: 10,
		paddingVertical: 10,
		display: "flex",
		flexDirection: "column",
	},
	cardTopIcon: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
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
		justifyContent: "space-around",
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
		borderRadius: 10,
		height: 40,
		width: 156,
	},
});
