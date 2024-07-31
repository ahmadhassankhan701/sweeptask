import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Avatar } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment/moment";

const Message = ({ item, index, handleImagePress }) => {
	const { state } = useContext(AuthContext);
	return (
		<View style={{ marginBottom: 5 }}>
			{item.senderId == state.user.uid ? (
				<View
					style={{
						backgroundColor: "#D5FBAE",
						padding: 15,
						marginLeft: "40%",
						borderRadius: 5,
						marginRight: "5%",
						alignSelf: "flex-end",
						borderRadius: 20,
					}}
					key={index}
				>
					<View
						style={{
							display: "flex",
							marginBottom: 5,
							flexDirection: "row",
							alignSelf: "center",
							flexWrap: "wrap",
							justifyContent: "space-between",
							gap: 1,
						}}
					>
						{item.images.length !== 0 &&
							item.images.map(
								(img, i) =>
									i < 4 && (
										<TouchableOpacity
											onPress={() => handleImagePress(item.images, i)}
											key={i}
											style={[
												{
													display: "flex",
													marginVertical: 2,
													borderRadius: 10,
												},
												item.images.length == 1
													? { width: "100%" }
													: { width: "49%" },
											]}
										>
											<View>
												<Image
													key={i}
													source={{ uri: img.url }}
													style={{
														width: "100%",
														height: 100,
														borderRadius: 10,
														objectFit: "cover",
													}}
												/>
											</View>
										</TouchableOpacity>
									)
							)}
					</View>
					{item.images.length !== 0 && item.images.length > 3 && (
						<Text
							style={{
								alignSelf: "flex-end",
								fontSize: 12,
								color: "gray",
								fontWeight: "bold",
								marginVertical: 5,
							}}
							onPress={() => handleImagePress(item.images, 0)}
						>
							More Images
						</Text>
					)}
					<Text
						style={{
							fontSize: 16,
							color: "#000000",
							flexWrap: "wrap",
							marginBottom: 1,
						}}
						key={index}
					>
						{item.text}
					</Text>
					<Text
						style={{
							fontSize: 10,
							fontWeight: "400",
							color: "gray",
							textAlign: "right",
						}}
					>
						{moment(item.date.seconds * 1000).format("DD/MM/YYYY")}
					</Text>
					<Text
						style={{
							fontSize: 10,
							fontWeight: "400",
							color: "gray",
							textAlign: "right",
						}}
					>
						{moment(item.date.seconds * 1000).format("hh:mm A")}
					</Text>
					<View style={styles.rightArrow}></View>
					<View style={styles.rightArrowOverlap}></View>
				</View>
			) : (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
					}}
				>
					<Avatar.Icon icon={"account"} size={40} style={{ marginRight: 10 }} />
					<View>
						<View
							style={{
								backgroundColor: "#F1F0F0",
								padding: 15,
								marginTop: 5,
								marginLeft: "5%",
								flexBasis: "auto",
								alignSelf: "flex-start",
								borderRadius: 20,
								maxWidth: "75%",
							}}
							key={index}
						>
							<View
								style={{
									// backgroundColor: "gray",
									display: "flex",
									marginBottom: 10,
									borderRadius: 10,
									// padding: 5,
									flexDirection: "row",
									alignSelf: "center",
									flexWrap: "wrap",
									justifyContent: "space-between",
									gap: 1,
								}}
							>
								{item.images.length !== 0 &&
									item.images.map(
										(img, i) =>
											i < 4 && (
												<TouchableOpacity
													onPress={() => handleImagePress(item.images, i)}
													key={i}
													style={[
														{
															display: "flex",
															marginVertical: 2,
															borderRadius: 10,
														},
														item.images.length == 1
															? { width: "100%" }
															: { width: "49%" },
													]}
												>
													<View>
														<Image
															key={i}
															source={{ uri: img.url }}
															style={{
																width: "100%",
																height: 100,
																borderRadius: 10,
																objectFit: "cover",
															}}
														/>
													</View>
												</TouchableOpacity>
											)
									)}
							</View>
							{item.images.length !== 0 && item.images.length > 3 && (
								<Text
									style={{
										alignSelf: "flex-end",
										fontSize: 12,
										color: "gray",
										fontWeight: "bold",
										marginVertical: 5,
									}}
									onPress={() => handleImagePress(item.images, 0)}
								>
									More Images
								</Text>
							)}
							<Text
								style={{
									fontSize: 15,
									fontWeight: "400",
									color: "#000",
									justifyContent: "center",
									marginBottom: 1,
									minWidth: "75%",
									flexWrap: "wrap",
								}}
								key={index}
							>
								{item.text}
							</Text>
							<Text
								style={{
									fontSize: 10,
									fontWeight: "400",
									color: "gray",
									textAlign: "right",
								}}
							>
								{moment(item.date.seconds * 1000).format("DD/MM/YYYY")}
							</Text>
							<Text
								style={{
									fontSize: 10,
									fontWeight: "400",
									color: "gray",
									textAlign: "right",
								}}
							>
								{moment(item.date.seconds * 1000).format("hh:mm A")}
							</Text>
							<View style={styles.leftArrow}></View>
							<View style={styles.leftArrowOverlap}></View>
						</View>
					</View>
				</View>
			)}
		</View>
	);
};

export default Message;

const styles = StyleSheet.create({
	rightArrow: {
		position: "absolute",
		backgroundColor: "#D5FBAE",
		width: 20,
		height: 25,
		bottom: 0,
		borderBottomLeftRadius: 25,
		right: -5,
	},

	rightArrowOverlap: {
		position: "absolute",
		backgroundColor: "lightgrey",
		width: 20,
		height: 35,
		bottom: -6,
		borderBottomLeftRadius: 18,
		right: -20,
	},
	/*Arrow head for recevied messages*/
	leftArrow: {
		position: "absolute",
		backgroundColor: "#F1F0F0",
		width: 20,
		height: 25,
		bottom: 0,
		borderBottomRightRadius: 25,
		left: -5,
	},

	leftArrowOverlap: {
		position: "absolute",
		backgroundColor: "lightgrey",
		width: 20,
		height: 35,
		bottom: -6,
		borderBottomRightRadius: 18,
		left: -20,
	},
});
