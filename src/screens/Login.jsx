import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useState } from "react";
import { Button } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
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
		const userRef = collection(db, "Users");
		const q = query(userRef, where("email", "==", details.email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.size == 0) {
			setLoading(false);
			alert("User not found. Please register first");
			return;
		}
		let item = {};
		querySnapshot.forEach((doc) => {
			item = { key: doc.id, data: doc.data() };
		});
		if (item.data.role !== "customer") {
			setLoading(false);
			alert("Please register as a customer");
			return;
		}
		if (item.data.suspended) {
			setLoading(false);
			alert("Your account is suspended for a while. Please contact support");
			return;
		}
		signInWithEmailAndPassword(auth, details.email, details.password)
			.then((userCredential) => {
				handleMailVerification(userCredential.user);
			})
			.catch((error) => {
				setLoading(false);
				alert(error.message);
				console.log(error);
			});
	};
	const handleMailVerification = async (users) => {
		try {
			if (users.emailVerified) {
				const docRef = doc(db, "Users", users.uid);
				const docSnap = await getDoc(docRef);
				const { email, name, city, suburb, suburbId } = docSnap.data();
				const push_token = await activateNotify(docRef);
				const user = {
					uid: users.uid,
					role: "customer",
					email,
					name,
					city,
					suburb,
					suburbId,
					push_token,
				};
				const stateData = { user };
				setState({
					user: stateData.user,
				});
				AsyncStorage.setItem("clean_auth", JSON.stringify(stateData));
				navigation.navigate("Home");
			} else {
				// await sendEmailVerification(auth.currentUser);
				await signOut(auth);
				setLoading(false);
				alert("Verification email sent to you. Verify then Login!");
			}
		} catch (error) {
			setLoading(false);
			alert(error.message);
			console.log(error);
		}
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
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<Image
				source={require("../assets/BlackLogo.png")}
				alt="logo"
				style={{ width: 225, height: 44, marginBottom: 50 }}
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
				<Text>{JSON.stringify(process.env.API_KEY)}</Text>
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
