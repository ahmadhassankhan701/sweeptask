import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Mood4Icon = (props) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 32 32"
		fill="#7B65CD"
		{...props}
	>
		<G clipPath="url(#clip0_709_1142)">
			<Path
				d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13 14.1152C13.5523 14.1152 14 13.7794 14 13.3652C14 12.951 13.5523 12.6152 13 12.6152C12.4477 12.6152 12 12.951 12 13.3652C12 13.7794 12.4477 14.1152 13 14.1152Z"
				fill="white"
			/>
			<Path
				d="M19.4615 14.1152C20.0138 14.1152 20.4615 13.7794 20.4615 13.3652C20.4615 12.951 20.0138 12.6152 19.4615 12.6152C18.9093 12.6152 18.4615 12.951 18.4615 13.3652C18.4615 13.7794 18.9093 14.1152 19.4615 14.1152Z"
				fill="white"
			/>
			<Path
				d="M20.6154 16.6152C20.1618 17.364 19.511 17.9854 18.728 18.4174C17.945 18.8494 17.0574 19.0768 16.1539 19.0768C15.2504 19.0768 14.3627 18.8494 13.5797 18.4174C12.7967 17.9854 12.1459 17.364 11.6923 16.6152"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</G>
		<Defs>
			<ClipPath id="clip0_709_1142">
				<Rect width={32} height={32} fill="white" />
			</ClipPath>
		</Defs>
	</Svg>
);
export default Mood4Icon;
