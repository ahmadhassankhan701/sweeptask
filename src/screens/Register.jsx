import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, IconButton, TextInput } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { Sizes } from "../utils/theme";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	where,
} from "firebase/firestore";
import PlacesModal from "../components/Modal/PlacesModal";
const Register = ({ navigation }) => {
	const [places, setPlaces] = useState([]);
	const [details, setDetails] = useState({
		name: "",
		phone: "",
		code: "+27",
		email: "",
		password: "",
		city: "",
		suburb: "",
		suburbId: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		phone: "",
		email: "",
		password: "",
	});
	const [placeModalVisible, setPlaceModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	useEffect(() => {
		getPlaces();
	}, []);
	const getPlaces = async () => {
		try {
			setLoading(true);
			const placesRef = collection(db, "Pricing");
			const q = query(placesRef);
			const querySnapshot = await getDocs(q);
			let items = [];
			querySnapshot.forEach((doc) => {
				items.push({
					key: doc.id,
					city: doc.data().city,
					suburb: doc.data().suburb,
				});
			});
			setPlaces(items);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			alert("Error getting places");
			console.log(error);
		}
	};
	const handleChange = async (name, value) => {
		if (name === "name") {
			setDetails({ ...details, name: value });
			if (value.length > 32) {
				setErrors({ ...errors, name: "Name is too long" });
			} else {
				setErrors({ ...errors, name: "" });
			}
		}
		if (name === "phone") {
			setDetails({ ...details, phone: value });
			if (value.length !== 9) {
				setErrors({
					...errors,
					phone: "Phone is 9 characters",
				});
			} else {
				setErrors({
					...errors,
					phone: "",
				});
			}
		}
		if (name === "email") {
			handleEmail(value);
		}
		if (name === "password") {
			handlePassword(value);
		}
	};
	const handlePassword = async (val) => {
		setDetails({ ...details, password: val });
		if (val.length < 8 || val.length > 20) {
			setErrors({
				...errors,
				password: "Password should be 8-20 characters",
			});
		} else {
			setErrors({
				...errors,
				password: "",
			});
		}
	};
	const handleEmail = async (val) => {
		setDetails({ ...details, email: val });
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (regex.test(val) === false) {
			setErrors({
				...errors,
				email: "Email is invalid",
			});
		} else {
			setErrors({
				...errors,
				email: "",
			});
		}
	};
	const handleSubmit = async () => {
		if (
			details.email == "" ||
			details.password == "" ||
			details.name == "" ||
			details.city == "" ||
			details.suburb == "" ||
			details.phone == ""
		) {
			alert("Please fill all the fields");
			return;
		}
		var emptyError =
			errors.name == "" && errors.email == "" && errors.password == "";
		if (emptyError == false) {
			alert("Please clear the errors");
			return;
		}
		setLoading(true);
		await createUserWithEmailAndPassword(auth, details.email, details.password)
			.then((userCredential) => {
				updateProfile(auth.currentUser, {
					displayName: details.name,
				});
				handleMailVerification(userCredential.user);
			})
			.catch((error) => {
				setLoading(false);
				if (error.code === "auth/email-already-in-use") {
					alert("Email already registered. Try using different email");
				} else {
					// Handle other errors during user creation
					alert("Error creating user:", error.message);
				}
				console.error(error);
			});
	};
	const handleMailVerification = async (users) => {
		try {
			await sendEmailVerification(auth.currentUser);
			let user = {
				role: "customer",
				name: details.name,
				email: details.email,
				phone: details.phone,
				city: details.city,
				suburb: details.suburb,
				suburbId: details.suburbId,
				image: "",
				createdAt: new Date(),
			};
			await setDoc(doc(db, "Users", users.uid), user);
			setLoading(false);
			alert("Verification mail sent. Once verified you can login!");
			navigation.navigate("Login");
		} catch (e) {
			setLoading(false);
			alert("Error adding user");
			console.log(e);
		}
	};
	const fillPlace = (place) => {
		setDetails({
			...details,
			city: place.city,
			suburb: place.suburb,
			suburbId: place.key,
		});
		setPlaceModalVisible(false);
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<PlacesModal
					visible={placeModalVisible}
					setVisible={setPlaceModalVisible}
					data={places}
					handleAction={fillPlace}
				/>
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
								source={require("../assets/loader.gif")}
								style={{
									alignSelf: "center",
									width: 250,
									height: 200,
								}}
							/>
						</View>
					)}
					<View style={styles.wrapper}>
						<View
							style={{
								height: "20%",
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
							<Image
								source={require("../assets/splash.png")}
								alt="logo"
								style={{
									width: 225,
									height: 44,
									marginBottom: 30,
								}}
							/>
						</View>
						<View
							style={{
								height: "80%",
							}}
						>
							{/* <Text>{JSON.stringify(places, null, 4)}</Text> */}
							<View>
								<InputText
									title={"Name"}
									name={"name"}
									handleChange={handleChange}
									value={details.name}
								/>
								{errors.name != "" && (
									<Text
										style={{
											color: "red",
											textAlign: "center",
										}}
									>
										{errors.name}
									</Text>
								)}
								<View
									style={{
										display: "flex",
										alignItems: "center",
										flexDirection: "row",
										width: "100%",
									}}
								>
									<TextInput
										label="Code"
										mode="outlined"
										style={{
											backgroundColor: "#ffffff",
											width: "30%",
											marginVertical: 10,
											fontSize: 12,
											marginRight: 5,
										}}
										outlineColor="#000000"
										activeOutlineColor={"#000000"}
										selectionColor={"gray"}
										value={details.code}
									/>
									<TextInput
										label="Phone number"
										mode="outlined"
										keyboardType="numeric"
										style={{
											backgroundColor: "#ffffff",
											width: "68%",
											marginVertical: 10,
											fontSize: 12,
										}}
										outlineColor="#000000"
										activeOutlineColor={"#000000"}
										selectionColor={"gray"}
										onChangeText={(text) => handleChange("phone", text)}
										value={details.phone}
									/>
								</View>
								{errors.phone != "" && (
									<Text
										style={{
											color: "red",
											textAlign: "center",
										}}
									>
										{errors.phone}
									</Text>
								)}
								<View
									style={{
										display: "flex",
										alignItems: "center",
										flexDirection: "row",
										justifyContent: "space-between",
										borderColor: "#000000",
										borderWidth: 1,
										backgroundColor: "#ffffff",
										borderRadius: 5,
										width: "100%",
									}}
								>
									<Text style={{ paddingLeft: 13, fontSize: 12 }}>
										{details.city == "" && details.suburb == ""
											? "Select Place"
											: details.city + ", " + details.suburb}
									</Text>
									<IconButton
										icon="chevron-down"
										onPress={() => setPlaceModalVisible(true)}
									/>
								</View>
								<InputText
									title={"Email"}
									name={"email"}
									handleChange={handleChange}
									value={details.email}
								/>
								{errors.email != "" && (
									<Text
										style={{
											color: "red",
											textAlign: "center",
										}}
									>
										{errors.email}
									</Text>
								)}
								<InputText
									title={"Set password"}
									name={"password"}
									handleChange={handleChange}
									value={details.password}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
								{errors.password != "" && (
									<Text
										style={{
											color: "red",
											textAlign: "center",
										}}
									>
										{errors.password}
									</Text>
								)}
								<Button
									mode="contained"
									style={{
										backgroundColor: "#000000",
										color: "#ffffff",
										borderRadius: 0,
										marginVertical: 20,
									}}
									onPress={handleSubmit}
								>
									Sign up
								</Button>
								<View
									style={{
										display: "flex",
										alignItems: "center",
										flexDirection: "row",
									}}
								>
									<Text>Already have an account? </Text>
									<TouchableOpacity
										onPress={() => navigation.navigate("Login")}
									>
										<Text style={{ fontWeight: "800" }}>Sign in</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		height: Sizes.height,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
		marginTop: 30,
	},
});
