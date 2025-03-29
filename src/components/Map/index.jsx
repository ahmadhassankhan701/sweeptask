import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import { useRef } from "react";
import { useState } from "react";
import { Sizes, colors } from "../../utils/theme";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
const CustomerMap = ({ location, handleChange, setLoading }) => {
	const mapView = useRef();
	const initialRegion = {
		latitude: location.currentLocation.lat || 31.4809172029034,
		longitude: location.currentLocation.lng || 74.32941843381401,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	const [region, setRegion] = useState({
		latitude: initialRegion.latitude,
		longitude: initialRegion.longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	});
	const getPermissions = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			alert("Please grant location permissions");
			return;
		}
		try {
			setLoading(true);
			let currentLocation = await Location.getCurrentPositionAsync({});
			getAddress(
				currentLocation.coords.latitude,
				currentLocation.coords.longitude
			);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			alert("Location failed");
			return;
		}
	};
	const getAddress = async (lat, lng) => {
		try {
			const pos = { lat, lng };
			const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
				longitude: lng,
				latitude: lat,
			});
			const city = reverseGeocodedAddress[0]?.city;
			const upperCaseCity = city?.toUpperCase();
			const address =
				reverseGeocodedAddress[0]?.name +
				", " +
				reverseGeocodedAddress[0]?.city +
				", " +
				reverseGeocodedAddress[0]?.country;
			handleChange(address, upperCaseCity, pos);
			setRegion({
				...region,
				latitude: lat,
				longitude: lng,
			});

			if (mapView.current) {
				mapView.current.animateToRegion(
					{
						latitude: lat,
						longitude: lng,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					},
					1000
				);
			}
		} catch (error) {
			setLoading(false);
			alert("Location failed");
			return;
		}
	};

	const onRegionChange = (region) => {
		setRegion(region);
	};
	return (
		<View>
			{/* <Text>{JSON.stringify(region, null, 4)}</Text> */}
			<View>
				<Button
					icon={"pin"}
					buttonColor={"#000000"}
					textColor="#ffffff"
					style={{
						width: "50%",
						alignSelf: "center",
						marginTop: 30,
						borderRadius: 0,
					}}
					mode="contained"
					onPress={getPermissions}
				>
					Current Location
				</Button>
			</View>
			<View style={styles.mapContainer}>
				<GooglePlacesAutocomplete
					placeholder=" 🔍 Search Location"
					fetchDetails={true}
					GooglePlacesSearchQuery={{
						rankby: "distance",
					}}
					GooglePlacesDetailsQuery={{
						fields: ["formatted_address", "geometry"],
					}}
					textInputProps={{
						placeholderTextColor: "gray",
					}}
					onPress={(data, details = null) => {
						if (details == null) {
							return;
						}
						let city;
						for (let i = 0; i < details.address_components.length; i++) {
							for (
								let j = 0;
								j < details.address_components[i].types.length;
								j++
							) {
								switch (details.address_components[i].types[j]) {
									case "locality":
										city = details.address_components[i].long_name;
										break;
								}
							}
						}
						const upperCaseCity = city?.toUpperCase();
						const address = details.formatted_address;
						const pos = {
							lat: details.geometry.location.lat,
							lng: details.geometry.location.lng,
						};
						handleChange(address, upperCaseCity, pos);
						setRegion({
							...region,
							latitude: pos.lat,
							longitude: pos.lng,
						});

						if (mapView.current) {
							mapView.current.animateToRegion(
								{
									latitude: pos.lat,
									longitude: pos.lng,
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
								},
								1000
							);
						}
					}}
					query={{
						key: "AIzaSyC0s7tq52XRV37QIon2GNNp1KoD07cSugI",
						language: "en",
						types: "establishment",
						radius: 8000,
						location: `${initialRegion?.latitude},${initialRegion?.longitude}`,
					}}
					styles={{
						container: {
							flex: 0,
							zIndex: 10,
							width: "100%",
							position: "absolute",
							top: 0,
							borderRadius: 10,
						},
						textInput: {
							fontSize: 15,
							margin: 10,
						},
						poweredContainer: {
							display: "none",
						},
						listView: {
							paddingHorizontal: 10,
						},
						row: {
							marginVertical: 2,
							borderBottomColor: `${colors.primary}`,
							backgroundColor: "yellow",
							borderBottomWidth: 2,
						},
					}}
				/>
				<MapView
					provider={PROVIDER_GOOGLE}
					ref={mapView}
					style={styles.map}
					initialRegion={initialRegion}
					onRegionChangeComplete={onRegionChange}
				>
					<Marker coordinate={region}>
						<Image
							source={require("../../assets/pin.png")}
							style={{
								height: 30,
								width: 30,
								resizeMode: "contain",
							}}
						/>
					</Marker>
				</MapView>
			</View>
		</View>
	);
};

export default CustomerMap;

const styles = StyleSheet.create({
	map: {
		width: Sizes.width - 20,
		height: 300,
	},
	mapContainer: {
		position: "relative",
		marginVertical: 10,
	},
});
