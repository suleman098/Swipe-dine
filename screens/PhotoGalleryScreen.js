import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { GOOGLE_API_KEY } from "../config";

const PhotoGalleryScreen = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.result?.photos) {
        setPhotos(data.result.photos);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPhoto = ({ item, index }) => {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${item.photo_reference}&key=${GOOGLE_API_KEY}`;

    return (
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={() =>
          navigation.navigate("PhotoView", {
            photos: photos,
            initialIndex: index,
            currentPhotoRef: item.photo_reference,
          })
        }
      >
        <Image source={{ uri: photoUrl }} style={styles.photo} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  photoContainer: {
    flex: 1 / 2,
    padding: 5,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PhotoGalleryScreen;
