import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, IconButton } from "react-native-paper";
import { Sizes } from "../../utils/theme";

const ProList = ({ pros, selectedPro, setSelectedPro }) => {
	return (
		<View>
			{/* <Text style={{ color: "white" }}>
				{JSON.stringify(org, null, 4)}
			</Text> */}
			{pros.map((pro) => (
				<Card style={styles.card} key={pro.key}>
					<Card.Content
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Text style={styles.title}>
							{pro.firstname + " " + pro.lastname}
						</Text>
						<IconButton
							icon={
								selectedPro && selectedPro.proId === pro.key
									? "check-circle"
									: "check-circle-outline"
							}
							iconColor="green"
							mode="contained"
							onPress={() => {
								setSelectedPro({
									proId: pro.key,
									proName:
										pro.firstname + " " + pro.lastname,
									proPhone: pro.phone,
									push_token: pro.push_token,
								});
							}}
						/>
					</Card.Content>
				</Card>
			))}
		</View>
	);
};

export default ProList;

const styles = StyleSheet.create({
	title: {
		color: "white",
		fontSize: 20,
		width: "70%",
	},
	card: {
		backgroundColor: "#000",
		borderRadius: 0,
		width: Sizes.width - 50,
	},
});
