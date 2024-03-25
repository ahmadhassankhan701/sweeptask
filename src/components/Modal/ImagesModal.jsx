import React, { useEffect, useRef, useState } from "react";
import {
	Modal,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Text,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Sizes } from "../../utils/theme";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
const ImagesModal = ({ images, visible, setVisible, currentImage }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const imagesRef = useRef();
	useEffect(() => {
		setCurrentImageIndex(currentImage);
	}, [currentImage]);

	const handleImageChange = (index) => {
		setCurrentImageIndex(index);
	};
	const hideModal = () => {
		setCurrentImageIndex(0);
		setVisible(false);
	};
	const downloadImage = async () => {
		try {
			const downloadInstance = FileSystem.createDownloadResumable(
				images[currentImageIndex].url,
				FileSystem.documentDirectory + "chat.jpg"
			);
			const result = await downloadInstance.downloadAsync();
			const permission = await MediaLibrary.requestPermissionsAsync();
			if (permission.granted === false) {
				alert("Permission is required to save the asset!");
				return;
			}
			const asset = await MediaLibrary.createAssetAsync(result.uri);

			MediaLibrary.createAlbumAsync("Clean_Task", asset, false);
			alert("File Saved Successfully");
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	return (
		<Modal visible={visible} onRequestClose={hideModal}>
			{images ? (
				<View>
					<View style={{ height: "70%" }}>
						<Image
							source={{ uri: images[currentImageIndex].url }}
							style={{
								width: Sizes.width,
								height: "100%",
								objectFit: "contain",
							}}
						/>
						<IconButton
							icon={"download"}
							iconColor="white"
							containerColor="gray"
							size={20}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
							}}
							onPress={downloadImage}
						/>
					</View>
					<ScrollView
						ref={imagesRef}
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ height: "20%" }}
						onContentSizeChange={() =>
							imagesRef.current.scrollTo({
								x: currentImageIndex * (Sizes.width / 3 - 9),
								y: 0,
								animated: true,
							})
						}
					>
						{images &&
							images.map((image, index) => (
								<TouchableOpacity
									key={index}
									style={
										currentImageIndex === index
											? {
													borderColor: "gray",
													borderWidth: 2,
													borderRadius: 10,
													marginHorizontal: 2,
											  }
											: {
													borderColor: "lightgray",
													borderWidth: 1,
													borderRadius: 10,
													marginHorizontal: 2,
											  }
									}
									onPress={() => handleImageChange(index)}
								>
									<Image
										source={{ uri: image.url }}
										style={{
											width: Sizes.width / 3 - 9,
											height: "100%",
											objectFit: "contain",
										}}
									/>
								</TouchableOpacity>
							))}
					</ScrollView>
					<View style={{ height: "10%" }}>
						<Button onPress={hideModal}>Close</Button>
					</View>
				</View>
			) : (
				<Text>Nothing Found</Text>
			)}
		</Modal>
	);
};

export default ImagesModal;
