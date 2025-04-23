import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const PhotoViewScreen = ({ route, navigation }) => {
  const { photos, initialIndex } = route.params;
  const flatListRef = React.useRef(null);

  React.useEffect(() => {
    if (flatListRef.current && initialIndex) {
      flatListRef.current.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, []);

  const renderPhoto = ({ item }) => (
    <View style={styles.photoContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.fullScreenImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="close" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  photoContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  fullScreenImage: {
    width: width,
    height: height,
    backgroundColor: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default PhotoViewScreen;
