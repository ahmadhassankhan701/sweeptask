import React, { useContext } from "react";
import AuthNavigator from "./AuthNavigator/index";
import CustomerNavigator from "./CustomerNavigator/index";
import { AuthContext } from "../context/AuthContext";
const index = () => {
	const { state } = useContext(AuthContext);
	return state && state.user ? (
		<CustomerNavigator />
	) : (
		<AuthNavigator />
	);
};

export default index;
