import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { GOOGLE_API_KEY } from "../config";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.65;

const PhotoCarouselWithDetails = ({ placeId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();

        if (data.result && data.result.photos) {
          // Transform photos array to include URLs
          const photoUrls = data.result.photos.map((photo) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&maxheight=800&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
            reference: photo.photo_reference,
          }));
          setPhotos(photoUrls);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchPhotos();
    }
  }, [placeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <View style={styles.noPhotosContainer}>
        <Text style={styles.noPhotosText}>No Photos Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photos.length > 0 && (
        <Image
          source={{ uri: photos[0].url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT,
    width: "100%",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  noPhotosText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PhotoCarouselWithDetails;
