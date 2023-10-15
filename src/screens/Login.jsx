import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useState } from "react";
import { Button } from "react-native-paper";
import InputText from "../components/Input/InputText";
import {
	sendEmailVerification,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { activateNotify } from "../utils/Helpers/NotifyConfig";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = ({ navigation }) => {
	const { setState } = useContext(AuthContext);
	const [details, setDetails] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = async (name, value) => {
		setDetails({ ...details, [name]: value });
	};
	const handleSubmit = async () => {
		if (details.email == "" || details.password == "") {
			alert("Please fill all the fields");
			return;
		}
		setLoading(true);
		signInWithEmailAndPassword(auth, details.email, details.password)
			.then((userCredential) => {
				const users = userCredential.user;
				handleMailVerification(users);
			})
			.catch((error) => {
				const errorMessage = error.message;
				setLoading(false);
				alert(errorMessage);
			});
	};
	const handleMailVerification = async (users) => {
		if (users.emailVerified == false) {
			sendEmailVerification(auth.currentUser).then(() => {
				alert(
					"Verification link sent to your email. Please verify then login!"
				);
				setLoading(false);
				return false;
			});
		}
		const docRef = doc(db, `Users`, users.uid);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					const res = docSnap.data();
					activateNotify(docRef)
						.then((push_token) => {
							const user = {
								uid: users.uid,
								role: "customer",
								email: res.email,
								name: res.name,
								city: res.city,
								suburb: res.suburb,
								push_token,
							};
							const stateData = { user };
							setState({
								user: stateData.user,
							});
							AsyncStorage.setItem("clean_auth", JSON.stringify(stateData));
							navigation.navigate("Home");
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					alert("User not found");
					setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
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
						source={require("../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}
			<Image
				source={require("../assets/splash.png")}
				alt="logo"
				style={{ width: 192, height: 44, marginBottom: 50 }}
			/>
			<View>
				<InputText
					title={"Email or Phone"}
					name={"email"}
					handleChange={handleChange}
					value={details.email}
				/>
				<InputText
					title={"Password"}
					name={"password"}
					handleChange={handleChange}
					value={details.password}
					showPassword={showPassword}
					setShowPassword={setShowPassword}
				/>
				<Text
					style={{
						textAlign: "right",
						marginVertical: 3,
					}}
				>
					Forgot password
				</Text>
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
					Sign in
				</Button>
				<View
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<Text>Don’t have an account? </Text>
					<TouchableOpacity onPress={() => navigation.navigate("Register")}>
						<Text style={{ fontWeight: "800" }}>Sign up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default Login;

const styles = StyleSheet.create({});
