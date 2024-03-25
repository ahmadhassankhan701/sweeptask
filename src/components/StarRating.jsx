import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const StarRating = ({ rate }) => {
	return (
		<View style={styles.ratingContainer}>
			{[1, 2, 3, 4, 5].map((star) => (
				<IconButton
					key={star}
					icon={"star"}
					size={20}
					iconColor={rate >= star ? "gold" : "white"}
					onPress={() => {}}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	ratingContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
});

export default StarRating;
