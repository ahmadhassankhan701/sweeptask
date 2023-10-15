import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Image,
} from "react-native";
import React, {
	useContext,
	useEffect,
	useState,
} from "react";
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
	const [bookings, setBookings] = useState(null);
	useEffect(() => {
		state && state.user && handleUpcoming();
	}, [state && state.user]);
	const handleChange = async (name, value) => {};
	const handleHistory = async (name, value) => {
		setMode("history");
		const bookRef = query(
			collection(db, "Bookings"),
			where("uid", "==", state.user.uid),
			where("status", "==", "completed"),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setBookings(null);
				return;
			}
			const data = querySnapshot.docs.map((doc) => ({
				key: doc.id,
				...doc.data(),
			}));
			setBookings(data);
		});
	};
	const handleUpcoming = async () => {
		setMode("upcoming");
		const bookRef = query(
			collection(db, "Bookings"),
			and(
				where("uid", "==", state.user.uid),
				or(
					where("status", "==", "requested"),
					where("status", "==", "assigned"),
					where("status", "==", "delayed"),
					where("status", "==", "accepted"),
					where("status", "==", "pending"),
					where("status", "==", "confirmed")
				)
			),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setBookings(null);
				return;
			}
			const data = querySnapshot.docs.map((doc) => ({
				key: doc.id,
				...doc.data(),
			}));
			setBookings(data);
		});
	};
	const handleDelete = async (docId, status, proToken) => {
		try {
			const docRef = doc(db, "Bookings", docId);
			await deleteDoc(docRef);
			if (status == "assigned") {
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
	const AskAdmin = async (docId) => {
		try {
			const docRef = doc(db, "Bookings", docId);
			await updateDoc(docRef, {
				mode: "admin",
			});
			alert("Request sent. Admin will contact you soon");
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
	const handleDelayModal = async (
		docId,
		pToken,
		prevDate
	) => {
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
	const handleBookingDone = async (docId, proToken) => {
		try {
			setActionLoading(true);
			const done = { customer: true, pro: false };
			const bookingRef = doc(db, `Bookings`, docId);
			await updateDoc(bookingRef, {
				status: "pending",
				done,
			});
			await sendNotification(
				proToken,
				"Customer Confirmed",
				"Great News. Customer has confirmed Booking Completion. Make sure to receive payment and confirm too!"
			);
			setActionLoading(false);
			Toast.show({
				type: "success",
				text1: "Congrats!",
				text2: "Wait for professional to confirm",
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something, went wrong!",
			});
			console.log(error);
		}
	};
	const handleBookingCancel = async (
		docId,
		customerId,
		proToken,
		payChoice,
		discountedAmount
	) => {
		try {
			setActionLoading(true);
			const payDataRecord =
				payChoice === "cash"
					? {
							customerCancelled: true,
					  }
					: {
							customerCancelled: true,
							paidBack: false,
					  };
			const userWalletRef = doc(db, `Users`, customerId);
			const bookingRef = doc(db, `Bookings`, docId);
			const payRef = doc(db, `Payments`, docId);
			const userWalletSnap = await getDoc(userWalletRef);
			const userWalletData = userWalletSnap.data().wallet;
			let wallet;
			const penalty = discountedAmount * 0.05;
			if (userWalletData) {
				wallet = {
					totalSpent: userWalletData.totalSpent,
					totalPenalty:
						userWalletData.totalPenalty + penalty,
					penaltyPaid: userWalletData.penaltyPaid,
				};
			} else {
				wallet = {
					totalSpent: 0,
					totalPenalty: penalty,
					penaltyPaid: 0,
				};
			}
			await updateDoc(userWalletRef, { wallet });
			await updateDoc(bookingRef, { status: "cancelled" });
			await updateDoc(payRef, payDataRecord);
			await sendNotification(
				proToken,
				"Request Cancelled",
				"Sad News. Customer has cancelled Cleaning Request!"
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
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-between",
				alignItems: "center",
				height: Sizes.height,
				marginTop: 50,
			}}
		>
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
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}
			<View>
				<View style={styles.wrapper}>
					{/* <Text>{JSON.stringify(bookings, null, 4)}</Text> */}
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexDirection: "row",
						}}
					>
						<DelayModal
							visible={visible}
							setVisible={setVisible}
							delay={delay}
							handleDelay={handleDelay}
						/>
						<Text style={styles.title}>My Bookings</Text>
						<IconButton
							size={35}
							icon={"plus-box-outline"}
							onPress={() =>
								navigation.navigate("NewBooking")
							}
						/>
					</View>
					<View
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
							marginVertical: 10,
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
							<Text style={styles.subtitleText}>
								History
							</Text>
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
							<Text style={styles.subtitleText}>
								Upcoming
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ height: "70%" }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						{bookings ? (
							mode === "upcoming" ? (
								bookings.map((booking, i) => (
									<NewBooking
										booking={booking}
										key={i}
										handleDelete={handleDelete}
										AskAdmin={AskAdmin}
										handleBookingCancel={
											handleBookingCancel
										}
										handleDelayModal={handleDelayModal}
										handleBookingDone={handleBookingDone}
										handleConfirm={handleConfirm}
									/>
								))
							) : (
								bookings.map((booking, i) => (
									// <DoneBooking
									// 	booking={booking}
									// 	key={i}
									// 	handleDelete={handleDelete}
									// 	handleCancel={handleCancel}
									// 	handleDelayModal={handleDelayModal}
									// />
									<Text>Hello</Text>
								))
							)
						) : (
							<Text style={{ textAlign: "center" }}>
								No bookings found
							</Text>
						)}
					</ScrollView>
				</View>
			</View>
			<Footer />
		</View>
	);
};

export default Booking;

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
