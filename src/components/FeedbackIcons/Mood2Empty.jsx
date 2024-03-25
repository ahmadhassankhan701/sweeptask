import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Mood2Empty = (props) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 32 32"
		fill="none"
		{...props}
	>
		<G clipPath="url(#clip0_709_1148)">
			<Path
				d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
				stroke="black"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M12.75 13.8076C13.1642 13.8076 13.5 13.4718 13.5 13.0576C13.5 12.6434 13.1642 12.3076 12.75 12.3076C12.3358 12.3076 12 12.6434 12 13.0576C12 13.4718 12.3358 13.8076 12.75 13.8076Z"
				fill="black"
			/>
			<Path
				d="M19.2115 13.8076C19.6258 13.8076 19.9615 13.4718 19.9615 13.0576C19.9615 12.6434 19.6258 12.3076 19.2115 12.3076C18.7973 12.3076 18.4615 12.6434 18.4615 13.0576C18.4615 13.4718 18.7973 13.8076 19.2115 13.8076Z"
				fill="black"
			/>
			<Path
				d="M21.2 18.9229C20.6714 18.0122 19.9128 17.2562 19.0002 16.7308C18.0876 16.2053 17.053 15.9287 16 15.9287C14.9469 15.9287 13.9123 16.2053 12.9998 16.7308C12.0872 17.2562 11.3286 18.0122 10.8 18.9229"
				stroke="black"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</G>
		<Defs>
			<ClipPath id="clip0_709_1148">
				<Rect width={32} height={32} fill="white" />
			</ClipPath>
		</Defs>
	</Svg>
);
export default Mood2Empty;
