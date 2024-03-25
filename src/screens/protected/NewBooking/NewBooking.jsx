import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Sizes } from "../../../utils/theme";
import { Button, Divider, IconButton, RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment";
const NewBooking = ({ navigation }) => {
	const [details, setDetails] = useState({
		bedrooms: "1",
		bathrooms: "1",
	});
	const [extras, setExtras] = useState([]);
	const [time, setTime] = useState(new Date());
	const [show, setShow] = useState(false);
	const handleTimeChange = (event, selectedDate) => {
		if (Platform.OS === "android") {
			setShow(false);
		}
		setTime(selectedDate);
	};
	const handleExtras = (name) => {
		if (extras.includes(name)) {
			setExtras(extras.filter((extra) => extra !== name));
		} else {
			setExtras([...extras, name]);
		}
	};
	const handleNext = async () => {
		if (details.bedrooms === "" || details.bathrooms === "" || time === "") {
			alert("Please fill required fields");
			return;
		}
		navigation.navigate("BookingPlace", {
			details,
			extras,
			date: `${time}`,
		});
	};
	return (
		<View style={styles.center}>
			<View style={styles.wrapper}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={styles.title}>House Rooms</Text>
					<Divider
						style={{
							marginVertical: 20,
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
					<View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text>Bedrooms</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									gap: 10,
								}}
							>
								<IconButton
									iconColor="#828282"
									size={40}
									icon={"minus-box"}
									onPress={() => {
										if (details.bedrooms > 0) {
											setDetails({
												...details,
												bedrooms: parseInt(details.bedrooms) - 1,
											});
										}
									}}
								/>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 20,
									}}
								>
									{details.bedrooms}
								</Text>
								<IconButton
									iconColor="#828282"
									size={40}
									icon={"plus-box"}
									onPress={() => {
										if (details.bedrooms < 10) {
											setDetails({
												...details,
												bedrooms: parseInt(details.bedrooms) + 1,
											});
										}
									}}
								/>
							</View>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text>Bathrooms</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									gap: 10,
								}}
							>
								<IconButton
									iconColor="#828282"
									size={40}
									icon={"minus-box"}
									onPress={() => {
										if (details.bathrooms > 0) {
											setDetails({
												...details,
												bathrooms: parseInt(details.bathrooms) - 1,
											});
										}
									}}
								/>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 20,
									}}
								>
									{details.bathrooms}
								</Text>
								<IconButton
									iconColor="#828282"
									size={40}
									icon={"plus-box"}
									onPress={() => {
										if (details.bathrooms < 10) {
											setDetails({
												...details,
												bathrooms: parseInt(details.bathrooms) + 1,
											});
										}
									}}
								/>
							</View>
						</View>
					</View>
					<Divider
						style={{
							marginVertical: 20,
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
					<Text style={styles.title}>Extras</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-around",
							alignItems: "center",
							marginVertical: 30,
						}}
					>
						<TouchableOpacity onPress={() => handleExtras("Laundry")}>
							<View
								style={
									extras.includes("Laundry")
										? {
												borderBottomColor: "#000000",
												borderBottomWidth: 5,
										  }
										: { border: "none" }
								}
							>
								<Image source={require("../../../assets/basket.png")} />
								<Text
									style={{
										fontWeight: "400",
										fontSize: 15,
										marginVertical: 5,
									}}
								>
									Laundry
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleExtras("Bin")}>
							<View
								style={[
									extras.includes("Bin")
										? {
												borderBottomColor: "#000000",
												borderBottomWidth: 5,
										  }
										: { border: "none" },
									{ alignItems: "center" },
								]}
							>
								<Image
									source={require("../../../assets/bin.png")}
									style={{ width: 50, height: 50 }}
								/>
								<Text
									style={{
										fontWeight: "400",
										fontSize: 15,
										marginVertical: 5,
									}}
								>
									Bin
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleExtras("Ironing")}>
							<View
								style={
									extras.includes("Ironing")
										? {
												borderBottomColor: "#000000",
												borderBottomWidth: 5,
										  }
										: { border: "none" }
								}
							>
								<Image source={require("../../../assets/iron.png")} />
								<Text
									style={{
										fontWeight: "400",
										fontSize: 15,
										marginVertical: 5,
									}}
								>
									Ironing
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<Divider
						style={{
							marginVertical: 20,
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
					<View style={{ marginVertical: 10 }}>
						<Text style={styles.title}>Date & time</Text>
						<View>
							<Button
								mode="contained"
								style={{
									marginTop: 20,
									borderRadius: 0,
								}}
								onPress={() => setShow(true)}
								buttonColor="#000000"
							>
								Select Date
							</Button>
							<Text style={{ marginTop: 10 }}>
								Selected Date : {moment(time).format("MMMM DD YYYY")}
							</Text>
							{show && (
								<>
									<RNDateTimePicker
										mode="date"
										display="spinner"
										value={time}
										onChange={handleTimeChange}
									/>
									{Platform.OS === "ios" && (
										<Button
											textColor="red"
											labelStyle={{ fontSize: 20 }}
											onPress={() => setShow(false)}
										>
											Close Picker
										</Button>
									)}
								</>
							)}
						</View>
					</View>
					<Divider
						style={{
							marginVertical: 20,
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
					<TouchableOpacity onPress={handleNext}>
						<Button
							mode="contained"
							buttonColor="#000000"
							textColor="#ffffff"
							style={{
								borderRadius: 0,
								width: "100%",
								height: 55,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							contentStyle={{
								flexDirection: "row-reverse",
							}}
							icon={"arrow-right"}
						>
							Next
						</Button>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
};

export default NewBooking;

const styles = StyleSheet.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
		paddingVertical: 20,
	},
	title: {
		fontWeight: "700",
		fontSize: 16,
		lineHeight: 19,
	},
	confirm: {
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 19,
	},
});
