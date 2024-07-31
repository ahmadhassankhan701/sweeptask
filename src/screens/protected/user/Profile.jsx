import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, IconButton, Modal, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ProfileField from "../../../components/Input/ProfileField";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes } from "../../../utils/theme";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image } from "react-native";
const Profile = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [userDetail, setUserDetail] = useState({
		name: "",
		email: "",
		image: "",
		city: "",
		phone: "",
		suburb: "",
	});
	const [user, setUser] = useState({});
	const [uploadedImage, setUploadedImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			const docRef = doc(db, `Users`, state.user.uid);
			getDoc(docRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						const res = docSnap.data();
						setUserDetail({
							...userDetail,
							name: res.name,
							email: res.email,
							image: res.image,
							city: res.city,
							phone: res.phone,
							suburb: res.suburb,
						});
						setLoading(false);
					} else {
						setLoading(false);
						navigation.navigate("Account");
					}
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		};
		state && state.user && fetchUser();
	}, [state && state.user]);
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem("clean_auth");
			setState({ ...state, user: null });
			navigation.navigate("Login");
		} catch (error) {
			console.log(error);
		}
	};
	const handleImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Gallery access is required");
			return;
		}
		// get image from gallery
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (pickerResult.canceled === true) {
			return;
		}
		setLoading(true);
		const path = `Profiles/customer/${state.user.uid}/${Date.now()}`;
		const img = await uploadImage(path, pickerResult.assets[0].uri);
		setUploadedImage(img);
		await saveImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			try {
				const result = await ImageManipulator.manipulateAsync(
					uri,
					[{ resize: { width: 100, height: 100 } }],
					{
						compress: 0.5,
						format: ImageManipulator.SaveFormat.JPEG,
					}
				);
				const response = await fetch(result.uri);
				const blob = await response.blob();
				const storageRef = ref(storage, imageReferenceID);
				await uploadBytes(storageRef, blob);
				return getDownloadURL(storageRef);
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		}
		return null;
	};
	const saveImage = async (img) => {
		try {
			const userRef = doc(db, `Users`, state.user.uid);
			await updateDoc(userRef, {
				image: img,
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const handleChange = (name, text) => {
		setUserDetail({ ...userDetail, [name]: text });
	};
	const updateUserProfile = async () => {
		try {
			if (
				userDetail.name === "" ||
				userDetail.phone === "" ||
				userDetail.city === "" ||
				userDetail.suburb === ""
			) {
				alert("No field should be empty");
				return;
			}
			setLoading(true);
			const userRef = doc(db, `Users`, state.user.uid);
			await updateDoc(userRef, {
				name: userDetail.name,
				phone: userDetail.phone,
				city: userDetail.city,
				suburb: userDetail.suburb,
			});
			setLoading(false);
			alert("Profile updated successfully");
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
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<View style={styles.wrapper}>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
					}}
					showsVerticalScrollIndicator={false}
				>
					<Portal>
						<Modal
							visible={visible}
							onDismiss={hideModal}
							contentContainerStyle={containerStyle}
						>
							<View>
								<Text style={{ textAlign: "center" }}>
									Are you sure you want to logout?
								</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-around",
										alignItems: "center",
									}}
								>
									<IconButton
										icon={"check-circle"}
										iconColor="green"
										size={35}
										onPress={handleLogout}
									/>
									<IconButton
										icon={"close-circle"}
										iconColor="red"
										size={35}
										onPress={hideModal}
									/>
								</View>
							</View>
						</Modal>
					</Portal>
					<View style={{ width: "100%" }}>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginVertical: 20,
							}}
						>
							{userDetail.image ? (
								<Avatar.Image size={40} source={{ uri: userDetail.image }} />
							) : uploadedImage ? (
								<Avatar.Image size={40} source={{ uri: uploadedImage }} />
							) : (
								<Avatar.Icon size={50} icon="account" />
							)}
						</View>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<IconButton
								icon={"camera"}
								mode="contained"
								containerColor={"#000000"}
								iconColor="white"
								onPress={handleImage}
							/>
						</View>
						<View>
							<ProfileField
								title={"Name"}
								name={"name"}
								val={userDetail.name}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"Email"}
								name={"email"}
								val={userDetail.email}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"City"}
								name={"city"}
								val={userDetail.city}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"Phone"}
								name={"phone"}
								val={userDetail.phone}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"Suburb"}
								name={"suburb"}
								val={userDetail.suburb}
								handleChange={handleChange}
							/>
							<TouchableOpacity onPress={updateUserProfile}>
								<Button
									mode="contained"
									textColor="#fff"
									style={{
										width: Sizes.width - 20,
										height: 55,
										alignSelf: "center",
										borderRadius: 5,
										borderColor: "#000000",
										marginTop: 10,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									buttonColor="#000000"
								>
									Update Profile
								</Button>
							</TouchableOpacity>
							<TouchableOpacity onPress={showModal}>
								<Button
									mode="outlined"
									textColor="#000000"
									style={{
										width: Sizes.width - 20,
										height: 55,
										alignSelf: "center",
										borderRadius: 5,
										borderColor: "#000000",
										marginTop: 10,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={showModal}
								>
									Sign out
								</Button>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => alert("Coming Soon")}>
								<Button
									mode="contained"
									textColor="#FFFFFF"
									style={{
										width: Sizes.width - 20,
										height: 55,
										alignSelf: "center",
										borderRadius: 5,
										borderColor: "#000000",
										marginTop: 10,
										marginBottom: 20,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									buttonColor="#F91111"
								>
									Delete account
								</Button>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 20,
		marginTop: 10,
		marginBottom: 20,
	},
});
