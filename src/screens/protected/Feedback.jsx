import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useState } from "react";
import { ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Mood5Icon from "../../components/FeedbackIcons/Mood5Icon";
import Mood5Empty from "../../components/FeedbackIcons/Mood5Empty";
import Mood4Icon from "../../components/FeedbackIcons/Mood4Icon";
import Mood4Empty from "../../components/FeedbackIcons/Mood4Empty";
import Mood3Icon from "../../components/FeedbackIcons/Mood3Icon";
import Mood3Empty from "../../components/FeedbackIcons/Mood3Empty";
import Mood2Icon from "../../components/FeedbackIcons/Mood2Icon";
import Mood2Empty from "../../components/FeedbackIcons/Mood2Empty";
import Mood1Icon from "../../components/FeedbackIcons/Mood1Icon";
import Mood1Empty from "../../components/FeedbackIcons/Mood1Empty";
import { Platform } from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
const Feedback = ({ route, navigation }) => {
	const { docId } = route.params;
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState({
		rate: 0,
		proRating: 0,
		desc: "",
	});
	const handleSubmit = async () => {
		if (feedback.rate == 0 || feedback.proRating == 0 || feedback.desc == "") {
			return alert("Please provide rating and feedback");
		}
		try {
			if (docId) {
				setLoading(true);
				const bookRef = doc(db, "Feedbacks", docId);
				const bookSnap = await getDoc(bookRef);
				if (bookSnap.exists()) {
					if (bookSnap.data().customer) {
						setLoading(false);
						return alert("You have already given feedback for this booking");
					} else {
						await updateDoc(bookRef, {
							customer: { feedback, timestamp: new Date() },
						});
					}
				} else {
					await setDoc(bookRef, {
						customer: { feedback, timestamp: new Date() },
					});
				}
				setLoading(false);
				navigation.navigate("Booking");
			}
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ImageBackground
					source={require("../../assets/success_bg.jpg")}
					style={styles.backgroundImage}
				>
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
					<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View style={styles.message}>
							<View>
								{/* <Text style={styles.title}>{docId}</Text> */}
								<Text style={styles.title}>Hurray! You Confirmed</Text>
								<Text style={styles.feed}>
									Rate your experience with the app
								</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-around",
										width: "50%",
										marginBottom: 10,
									}}
								>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, rate: 5 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.rate == 5 ? <Mood5Icon /> : <Mood5Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, rate: 4 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.rate == 4 ? <Mood4Icon /> : <Mood4Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, rate: 3 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.rate == 3 ? <Mood3Icon /> : <Mood3Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, rate: 2 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.rate == 2 ? <Mood2Icon /> : <Mood2Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, rate: 1 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.rate == 1 ? <Mood1Icon /> : <Mood1Empty />}
									</TouchableOpacity>
								</View>
								<Text style={styles.feed}>
									Rate your experience with the professional
								</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-around",
										width: "50%",
										marginBottom: 10,
									}}
								>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, proRating: 5 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.proRating == 5 ? <Mood5Icon /> : <Mood5Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, proRating: 4 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.proRating == 4 ? <Mood4Icon /> : <Mood4Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, proRating: 3 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.proRating == 3 ? <Mood3Icon /> : <Mood3Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, proRating: 2 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.proRating == 2 ? <Mood2Icon /> : <Mood2Empty />}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setFeedback({ ...feedback, proRating: 1 })}
										style={{ marginRight: 10, marginTop: 5 }}
									>
										{feedback.proRating == 1 ? <Mood1Icon /> : <Mood1Empty />}
									</TouchableOpacity>
								</View>
								<TextInput
									// label="Your Feedback"
									placeholder="Your Feedback"
									mode="outlined"
									multiline
									numberOfLines={3}
									maxLength={200}
									style={{ marginBottom: 20, width: "100%" }}
									onChangeText={(text) =>
										setFeedback({ ...feedback, desc: text })
									}
								/>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-end",
										gap: 10,
									}}
								>
									<Button
										mode="contained"
										buttonColor="#000"
										textColor="#fff"
										theme={{ roundness: 0 }}
										onPress={() => {
											navigation.navigate("Booking");
										}}
									>
										Leave
									</Button>
									<Button
										mode="contained"
										buttonColor="#000"
										textColor="#fff"
										theme={{ roundness: 0 }}
										onPress={handleSubmit}
									>
										Submit
									</Button>
								</View>
							</View>
						</View>
					</ScrollView>
				</ImageBackground>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default Feedback;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		resizeMode: "cover", // or 'stretch',
	},
	message: {
		width: "90%",
		alignSelf: "center",
	},
	title: {
		fontSize: 24,
		color: "#000",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	desc: {
		fontSize: 16,
		color: "gray",
		fontWeight: "400",
		marginBottom: 10,
	},
	feed: {
		fontSize: 14,
		color: "gray",
		fontWeight: "400",
		marginBottom: 10,
	},
});
