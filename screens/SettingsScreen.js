import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_API_KEY } from "../config";
import Logo from "../components/Logo";

const SettingsScreen = ({ navigation }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [locationInfo, setLocationInfo] = useState(null);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        // Save current location
        await AsyncStorage.setItem(
          "currentLocation",
          JSON.stringify(location.coords)
        );

        // Set initial settings if none exist
        const settings = await AsyncStorage.getItem("locationSettings");
        if (!settings) {
          await AsyncStorage.setItem(
            "locationSettings",
            JSON.stringify({ useCurrentLocation: true })
          );
          setUseCurrentLocation(true);
          const cityName = await getCityName(location.coords);
          setLocationInfo(cityName);
        }
      }
    } catch (error) {
      console.error("Error initializing location:", error);
    }
  };

  const getCityName = async (coords) => {
    try {
      // First try using Expo Location's reverse geocoding (doesn't require API key)
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        return `${location.city || location.subregion || location.district}, ${
          location.country
        }`;
      }

      // Fallback to coordinates if geocoding fails
      return `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;
    } catch (error) {
      console.error("Geocoding error:", error);
      return `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("locationSettings");
      if (settings) {
        const { useCurrentLocation } = JSON.parse(settings);
        setUseCurrentLocation(useCurrentLocation);

        if (useCurrentLocation) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          console.log("Current location coordinates:", location.coords);

          const locationName = await getCityName(location.coords);
          console.log("Location name resolved:", locationName);

          setLocationInfo(locationName);
          await AsyncStorage.setItem(
            "currentLocation",
            JSON.stringify(location.coords)
          );
        } else {
          const customLocation = await AsyncStorage.getItem("customLocation");
          if (customLocation) {
            const customData = JSON.parse(customLocation);
            setLocationInfo(customData.description);
          }
        }
      }
    } catch (error) {
      console.error("Settings load error:", error);
      setLocationInfo("Error loading location");
    }
  };

  const toggleLocationPreference = async () => {
    try {
      if (!useCurrentLocation) {
        // Switching TO current location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Required", "Location access is needed");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const locationName = await getCityName(location.coords);

        await AsyncStorage.setItem(
          "currentLocation",
          JSON.stringify(location.coords)
        );
        await AsyncStorage.removeItem("customLocation");
        await AsyncStorage.setItem(
          "locationSettings",
          JSON.stringify({ useCurrentLocation: true })
        );

        setUseCurrentLocation(true);
        setLocationInfo(locationName);

        Alert.alert("Location Updated", "Now using your current location");
      } else {
        // Switching to custom location
        await AsyncStorage.setItem(
          "locationSettings",
          JSON.stringify({ useCurrentLocation: false })
        );

        setUseCurrentLocation(false);
        const customLocation = await AsyncStorage.getItem("customLocation");
        if (customLocation) {
          const customData = JSON.parse(customLocation);
          setLocationInfo(customData.description || "Custom Location");
        } else {
          setLocationInfo("No custom location set");
        }
      }
    } catch (error) {
      console.error("Settings toggle error:", error);
      Alert.alert("Error", "Could not update location settings");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSettings();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    initializeLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Logo />
      <View style={[styles.section, { marginTop: 60 }]}>
        <Text style={styles.sectionTitle}>Location Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Use Current Location</Text>
          <Switch
            value={useCurrentLocation}
            onValueChange={toggleLocationPreference}
          />
        </View>

        {locationInfo && (
          <View style={styles.locationInfo}>
            <FontAwesome name="map-marker" size={16} color="#fff" />
            <Text style={styles.locationText}>{locationInfo}</Text>
          </View>
        )}

        {!useCurrentLocation && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LocationPicker")}
          >
            <FontAwesome name="map-marker" size={20} color="#fff" />
            <Text style={styles.buttonText}>Set Custom Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    color: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  locationText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});

export default SettingsScreen;
