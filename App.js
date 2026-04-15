import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./styles";

const API_KEY = "AIzaSyAk6Km5bhQiWdUv8PKXryZRPl09FywtbC4";
const URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=`;

export default function WhereAmI() {
  const [address, setAddress] = useState("loading...");
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [errorMsg, setErrorMsg] = useState(null);

  const restaurant = {
    latitude: 41.6766,
    longitude: -86.2515,
    title: "Fiddler's Hearth",
    description: "Nearby restaurant for my assignment",
  };

  useEffect(() => {
    function setPosition({ coords: { latitude, longitude } }) {
      setLongitude(longitude);
      setLatitude(latitude);

      fetch(`${URL}${latitude},${longitude}`)
        .then((resp) => resp.json())
        .then((json) => {
          if (json.results && json.results.length > 0) {
            setAddress(json.results[0].formatted_address);
          } else {
            console.log("Google API Error Status:", json.status);
          }
        })
        .catch((error) => {
          console.log("Geocoding Error", error.message);
        });
    }
    let watcher;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeout: 10000,
        });
        setPosition(location);
      } catch (e) {
        let lastLocation = await Location.getLastKnownPositionAsync({});
        if (lastLocation) setPosition(lastLocation);
        else console.log("Could not find any location.");
      }

      watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 5 },
        setPosition,
      );
    })();

    return () => {
      watcher?.remove();
    };
  }, []);
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Maps are not supported in the Web preview.
        </Text>
        <Text style={styles.label}>
          Please use the Android or iOS tab to view the map.
        </Text>
        <View style={localStyles.overlay}>
          <Text style={styles.label}>Address: {address}</Text>
          <Text style={styles.label}>
            Lat: {latitude} | Long: {longitude}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {latitude && longitude ? (
        <MapView
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.title}
            description={restaurant.description}
            pinColor="red"
          />
        </MapView>
      ) : (
        <View style={styles.container}>
          <Text>{errorMsg || "Getting Location..."}</Text>
        </View>
      )}
      <View style={localStyles.overlay}>
        <Text style={styles.label}>Address: {address}</Text>
        <Text style={styles.label}>
          Lat: {latitude} | Long: {longitude}
        </Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
  },
});
