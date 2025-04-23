import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { GOOGLE_API_KEY } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LocationPickerScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_API_KEY}&types=(cities)`
      );
      const data = await response.json();
      setSearchResults(data.predictions || []);
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  const handleSelectLocation = async (placeId, description) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.result?.geometry?.location) {
        const locationData = {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
          description: description,
        };

        await AsyncStorage.setItem(
          "customLocation",
          JSON.stringify(locationData)
        );
        await AsyncStorage.setItem(
          "locationSettings",
          JSON.stringify({
            useCurrentLocation: false, // Set to false when using custom location
          })
        );

        Alert.alert("Location Set", `Custom location set to: ${description}`, [
          { text: "OK" },
        ]);

        navigation.goBack();
      }
    } catch (error) {
      console.error("Location selection error:", error);
      Alert.alert("Error", "Failed to set custom location");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a city..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text.length > 2) {
            searchLocation(text);
          }
        }}
        placeholderTextColor="#666"
      />
      {searchResults.map((result) => (
        <TouchableOpacity
          key={result.place_id}
          style={styles.resultItem}
          onPress={() =>
            handleSelectLocation(result.place_id, result.description)
          }
        >
          <Text style={styles.resultText}>{result.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 20,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LocationPickerScreen;
