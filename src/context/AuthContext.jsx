import React, {
	useState,
	useEffect,
	createContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [state, setState] = useState({
		user: null,
	});
	// navigation
	useEffect(() => {
		const loadFromAsyncStorage = async () => {
			let data = await AsyncStorage.getItem("clean_auth");
			const as = JSON.parse(data);
			if (as) {
				setState({
					...state,
					user: as.user,
				});
			}
		};
		loadFromAsyncStorage();
	}, []);

	return (
		<AuthContext.Provider value={{ state, setState }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
