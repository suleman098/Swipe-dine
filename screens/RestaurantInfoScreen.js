import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { GOOGLE_API_KEY } from "../config";

const { height } = Dimensions.get("window");
const PHOTO_HEIGHT = height * 0.5; // 50% of screen height

const RestaurantInfoScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [details, setDetails] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=formatted_phone_number,opening_hours,website,price_level,photos&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.result) {
        setDetails(data.result);
        if (data.result.photos) {
          const photoUrls = data.result.photos.map((photo) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
          }));
          setPhotos(photoUrls);
        }
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ScrollView
          horizontal
          style={[styles.photoGallery, { height: PHOTO_HEIGHT }]}
        >
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("PhotoView", {
                  photos,
                  initialIndex: index,
                })
              }
            >
              <Image
                source={{ uri: photo.url }}
                style={[
                  styles.photo,
                  { height: PHOTO_HEIGHT, width: PHOTO_HEIGHT * 1.5 },
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.rating}>
            ⭐ {restaurant.rating} • {restaurant.user_ratings_total} reviews
          </Text>
          <Text style={styles.address}>{restaurant.vicinity}</Text>

          {details?.formatted_phone_number && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Linking.openURL(`tel:${details.formatted_phone_number}`)
              }
            >
              <FontAwesome name="phone" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {details.formatted_phone_number}
              </Text>
            </TouchableOpacity>
          )}

          {details?.website && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(details.website)}
            >
              <FontAwesome name="globe" size={20} color="#fff" />
              <Text style={styles.buttonText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flex: 1,
  },
  photoGallery: {
    height: PHOTO_HEIGHT,
  },
  photo: {
    height: PHOTO_HEIGHT,
    width: PHOTO_HEIGHT * 1.5, // maintain aspect ratio
    marginRight: 10,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RestaurantInfoScreen;
