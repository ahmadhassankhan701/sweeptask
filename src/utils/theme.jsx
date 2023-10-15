import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const colors = {
	primary: "rgba(255, 171, 13, 1)",
	secondary: "rgba(196, 196, 196, 0.15)",
	title: "rgba(0, 0, 0, 1)",
	desc: "rgba(104, 104, 104, 1)",
	inputTitleText: "rgba(95, 95, 95, 1)",
	inputText: "rgba(75, 80, 109, 1)",
};

export const Sizes = {
	h1: 22,
	h2: 20,
	h3: 18,
	h4: 16,
	h5: 14,
	h6: 12,
	width,
	height,
};
