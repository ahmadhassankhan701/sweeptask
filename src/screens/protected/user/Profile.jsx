import { StyleSheet, Text, View } from "react-native";
import React, {
	useContext,
	useEffect,
	useState,
} from "react";
import {
	ActivityIndicator,
	Avatar,
	Button,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ProfileField from "../../../components/Input/ProfileField";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes, colors } from "../../../utils/theme";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
const Profile = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
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
						setUser(res);
						setLoading(false);
					} else {
						alert("User not found");
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
		let pickerResult =
			await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		if (pickerResult.canceled === true) {
			return;
		}
		const path = `Profiles/customer/${
			state.user.uid
		}/${Date.now()}`;
		const img = await uploadImage(
			path,
			pickerResult.assets[0].uri
		);
		setUploadedImage(img);
		await saveImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
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
		}
		return null;
	};
	const saveImage = async (img) => {
		const userRef = doc(
			db,
			`Auth/customer/users`,
			state.user.uid
		);
		await updateDoc(userRef, {
			image: img,
		});
	};
	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
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
				{loading ? (
					<ActivityIndicator
						style={{ paddingTop: 50 }}
						size={50}
						animating={loading}
						color={"gray"}
					/>
				) : (
					<View style={{ width: "100%" }}>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginVertical: 20,
							}}
						>
							{user.image ? (
								<Avatar.Image
									size={40}
									source={{ uri: user.image }}
								/>
							) : uploadedImage ? (
								<Avatar.Image
									size={40}
									source={{ uri: uploadedImage }}
								/>
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
								val={user.name}
							/>
							<ProfileField
								title={"Email"}
								val={user.email}
							/>
							<Button
								mode="outlined"
								textColor="#000000"
								style={{
									width: Sizes.width - 20,
									height: 55,
									alignSelf: "center",
									borderRadius: 0,
									borderColor: "#000000",
									marginTop: 30,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								onPress={showModal}
							>
								Sign out
							</Button>
							<Button
								mode="contained"
								textColor="#FFFFFF"
								style={{
									width: Sizes.width - 20,
									height: 55,
									alignSelf: "center",
									borderRadius: 0,
									borderColor: "#000000",
									marginTop: 10,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								buttonColor="#F91111"
							>
								Delete account
							</Button>
						</View>
					</View>
				)}
			</View>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
	},
});
