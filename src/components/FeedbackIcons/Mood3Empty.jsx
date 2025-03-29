import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Mood3Empty = (props) => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 32 32"
		fill="none"
		{...props}
	>
		<G clipPath="url(#clip0_709_1154)">
			<Path
				d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
				stroke="black"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M12.7273 13.8076C13.1289 13.8076 13.4545 13.4718 13.4545 13.0576C13.4545 12.6434 13.1289 12.3076 12.7273 12.3076C12.3256 12.3076 12 12.6434 12 13.0576C12 13.4718 12.3256 13.8076 12.7273 13.8076Z"
				fill="black"
			/>
			<Path
				d="M19.1888 13.8076C19.5905 13.8076 19.9161 13.4718 19.9161 13.0576C19.9161 12.6434 19.5905 12.3076 19.1888 12.3076C18.7872 12.3076 18.4615 12.6434 18.4615 13.0576C18.4615 13.4718 18.7872 13.8076 19.1888 13.8076Z"
				fill="black"
			/>
			<Path
				d="M12.9231 17.5386H18.7692"
				stroke="black"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</G>
		<Defs>
			<ClipPath id="clip0_709_1154">
				<Rect width={32} height={32} fill="white" />
			</ClipPath>
		</Defs>
	</Svg>
);
export default Mood3Empty;
