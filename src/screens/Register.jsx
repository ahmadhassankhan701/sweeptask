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
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
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
const Register = ({ navigation }) => {
	const [details, setDetails] = useState({
		name: "",
		phone: "",
		code: "+27",
		email: "",
		password: "",
		city: "",
		suburb: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		code: "+27",
		phone: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = async (name, value) => {
		if (name === "name") {
			setDetails({ ...details, name: value });
			if (value.length > 32) {
				setErrors({ ...errors, name: "Name is too long" });
			} else {
				setErrors({ ...errors, name: "" });
			}
		}
		if (name === "city") {
			setDetails({ ...details, city: value });
		}
		if (name === "suburb") {
			setDetails({ ...details, suburb: value });
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
		if (val.length < 6 || val.length > 14) {
			setErrors({
				...errors,
				password: "Password should be 6-14 characters",
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
			errors.name == "" &&
			errors.email == "" &&
			errors.password == "";
		if (emptyError == false) {
			alert("Please clear the errors");
			return;
		}
		setLoading(true);
		alreadyExists();
		await createUserWithEmailAndPassword(
			auth,
			details.email,
			details.password
		)
			.then((userCredential) => {
				const users = userCredential.user;
				updateProfile(auth.currentUser, {
					displayName: details.name,
				});
				handleMailVerification(users);
			})
			.catch((error) => {
				if (error.code === "auth/email-already-in-use") {
					alert(
						"Email already registered. Try using different email"
					);
					return false;
				} else {
					// Handle other errors during user creation
					const errorMessage = error.message;
					console.error(
						"Error creating user:",
						errorMessage
					);
					alert("Error creating user:", errorMessage);
				}
				setLoading(false);
			});
	};
	const alreadyExists = async () => {
		const userRef = collection(db, "Users");
		const q = query(
			userRef,
			where("email", "==", details.email)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.size > 0) {
			setLoading(false);
			alert("Email already in use.Please use another!");
			return false;
		}
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
				image: "",
				createdAt: serverTimestamp(),
			};
			await setDoc(doc(db, "Users", users.uid), user);
			setLoading(false);
			alert(
				"Verification mail sent. Once verified you can login!"
			);
			navigation.navigate("Login");
		} catch (e) {
			setLoading(false);
			alert("Error adding user");
			console.log(e);
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
						source={require("../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
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
							width: 192,
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
					<KeyboardAvoidingView
						behavior={
							Platform.OS === "ios" ? "padding" : "height"
						}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
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
										onChangeText={(text) =>
											handleChange("phone", text)
										}
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
										width: "100%",
									}}
								>
									<TextInput
										label="City"
										mode="outlined"
										style={{
											backgroundColor: "#ffffff",
											width: "50%",
											marginVertical: 10,
											fontSize: 12,
											marginRight: 5,
										}}
										outlineColor="#000000"
										activeOutlineColor={"#000000"}
										selectionColor={"gray"}
										onChangeText={(text) =>
											handleChange("city", text)
										}
										value={details.city}
									/>
									<TextInput
										label="Suburb"
										mode="outlined"
										style={{
											backgroundColor: "#ffffff",
											width: "48%",
											marginVertical: 10,
											fontSize: 12,
										}}
										outlineColor="#000000"
										activeOutlineColor={"#000000"}
										selectionColor={"gray"}
										onChangeText={(text) =>
											handleChange("suburb", text)
										}
										value={details.suburb}
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
										onPress={() =>
											navigation.navigate("Login")
										}
									>
										<Text style={{ fontWeight: "800" }}>
											Sign in
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</View>
		</View>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
		marginTop: 30,
	},
});
