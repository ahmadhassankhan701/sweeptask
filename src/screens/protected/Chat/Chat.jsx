import {
	KeyboardAvoidingView,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IconButton, TextInput } from "react-native-paper";
import { Sizes } from "../../../utils/theme";
import { AuthContext } from "../../../context/AuthContext";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { Image } from "react-native";
import Message from "../../../components/Message/Message";
import ImagesModal from "../../../components/Modal/ImagesModal";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";

const Chat = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const { proName, proToken, proId, proPhone } = route.params;
	const chatRef = useRef();
	const [chatText, setChatText] = useState("");
	const [chatImages, setChatImages] = useState([]);
	const [messages, setMessages] = useState(null);
	const [visible, setVisible] = useState(null);
	const [loading, setLoading] = useState(true);
	const [fullImages, setFullImages] = useState(null);
	const [fullImageIndex, setFullImageIndex] = useState(0);
	useEffect(() => {
		const fetchChats = async () => {
			const chatId =
				state.user.uid > proId
					? state.user.uid + proId
					: proId + state.user.uid;
			const getMessages = onSnapshot(doc(db, "Chats", chatId), (doc) => {
				setLoading(true);
				if (doc.exists()) {
					setMessages(doc.data().messages);
					// console.log(doc.data().messages);
				}
				setLoading(false);
			});
			return () => {
				getMessages();
			};
		};
		state && state.user && fetchChats();
	}, [state && state.user]);
	const handleImagePress = (images, index) => {
		setFullImages(images);
		setFullImageIndex(index);
		setVisible(true);
	};
	const generateId = () => {
		const val = Math.floor(100000 + Math.random() * 900000);
		return val;
	};
	const handleSend = async () => {
		if (chatText === "" && chatImages.length === 0) {
			return;
		}
		try {
			setLoading(true);
			if (chatImages.length > 0) {
				await uploadImages();
			} else {
				await saveData([]);
			}
			setLoading(false);
		} catch (error) {
			// alert("Message not sent");
			setLoading(false);
			alert(error);
			console.log(error);
		}
	};
	const uploadImages = async () => {
		const promises = chatImages.map((image) => {
			let path = `Chats/${state.user.uid}/${Date.now()}`;
			return uploadImage(path, image);
		});
		const results = await Promise.all(promises);
		await saveData(results);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 500, height: 500 } }],
				{
					compress: 0.6,
					format: ImageManipulator.SaveFormat.JPEG,
				}
			);
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			const img = await getDownloadURL(storageRef);
			const imgObject = {
				path: imageReferenceID,
				url: img,
			};
			return imgObject;
		}
		return null;
	};
	const saveData = async (results) => {
		const chatId =
			state.user.uid > proId ? state.user.uid + proId : proId + state.user.uid;
		const newMessage = {
			id: generateId(),
			senderId: state.user.uid,
			text: chatText,
			images: results,
			date: new Date(),
		};
		const docRef = doc(db, "Chats", chatId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			await updateDoc(docRef, {
				messages: arrayUnion(newMessage),
			});
		} else {
			await setDoc(docRef, {
				messages: [newMessage],
			});
		}
		await sendNotification(
			proToken,
			"New Message",
			`${proName} sent you a message`
		);
		setChatText("");
		setChatImages([]);
	};
	const handleImages = async () => {
		try {
			let permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (permissionResult.granted === false) {
				alert("Library access is required");
				return;
			}
			// get image from gallery
			let pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
				aspect: [4, 3],
				quality: 1,
				selectionLimit: 10,
			});
			if (pickerResult.canceled) {
				return;
			}
			pickerResult.assets.map((image) => {
				setChatImages((chatImages) => [...chatImages, image.uri]);
			});
			// const path = `Events/${userId}/${Date.now()}`;
			// const img = await uploadImage(
			// 	path,
			// 	pickerResult.assets[0].uri
			// );
		} catch (error) {
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
			<ImagesModal
				visible={visible}
				setVisible={setVisible}
				images={fullImages}
				currentImage={fullImageIndex}
			/>
			<View style={styles.chatTop}>
				<View
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<IconButton icon={"close"} onPress={() => navigation.goBack()} />
					<Text
						style={{
							fontWeight: "600",
							fontSize: 16,
							lineHeight: 20,
						}}
					>
						{proName}
					</Text>
					<IconButton
						icon={"phone"}
						mode="contained"
						containerColor="#000"
						iconColor="#fff"
						size={15}
						onPress={() => {
							Linking.openURL(`tel:+27${proPhone}`);
						}}
					/>
				</View>
			</View>
			{chatImages.length === 0 ? (
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.messages}
					ref={chatRef}
					contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
					onContentSizeChange={() =>
						chatRef.current.scrollToEnd({ animated: true })
					}
				>
					{messages !== null ? (
						messages.map((message, index) => (
							<Message
								item={message}
								index={index}
								key={index}
								handleImagePress={handleImagePress}
							/>
							// <Text>acha</Text>
						))
					) : (
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								flex: 1,
							}}
						>
							<Image
								source={require("../../../assets/no_chat.png")}
								width={30}
								height={30}
							/>
							<Text>No Messages Yet</Text>
						</View>
					)}
				</ScrollView>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.messages}
					ref={chatRef}
					contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
					onContentSizeChange={() =>
						chatRef.current.scrollToEnd({ animated: true })
					}
				>
					<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
						{chatImages.map((image, index) => (
							<View
								style={{
									width: "50%",
									marginVertical: 5,
								}}
								key={index}
							>
								<Image
									source={{ uri: image }}
									style={{ width: "100%", height: 150, objectFit: "contain" }}
								/>
							</View>
						))}
					</View>
					{chatImages.length !== 0 && (
						<Text
							style={{ textAlign: "center", marginVertical: 10, color: "gray" }}
							onPress={() => setChatImages([])}
						>
							Clear
						</Text>
					)}
				</ScrollView>
			)}
			<View style={styles.chatBottom}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							width: "10%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<IconButton
							icon={"camera"}
							mode="contained"
							containerColor="#000"
							iconColor="#fff"
							size={17}
							onPress={handleImages}
						/>
					</View>
					<TextInput
						style={{
							width: "70%",
							backgroundColor: "#000",
							marginHorizontal: 2,
							fontSize: 15,
							fontWeight: "bold",
						}}
						placeholder="Write message..."
						mode="outlined"
						theme={{ roundness: 10 }}
						outlineColor="#6F7378"
						activeOutlineColor="#fff"
						contentStyle={{ color: "#fff" }}
						placeholderTextColor={"#fff"}
						value={chatText}
						onChangeText={(text) => setChatText(text)}
					/>
					<View
						style={{
							width: "10%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<IconButton
							icon={"send"}
							mode="contained"
							containerColor="#000"
							iconColor="#fff"
							size={17}
							onPress={handleSend}
						/>
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default Chat;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
	},
	chatTop: {
		width: Sizes.width - 10,
		marginTop: 30,
	},
	chatBottom: {
		width: Sizes.width,
		marginBottom: Platform.OS === "ios" ? 20 : 0,
	},
	messages: {
		flexDirection: "column",
		backgroundColor: "lightgray",
		width: "100%",
		paddingHorizontal: 10,
	},
});
