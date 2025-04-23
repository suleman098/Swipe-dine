import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import PhotoCarousel from "./PhotoCarousel";
import RestaurantDetails from "./RestaurantDetails";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

const RestaurantCard = ({ restaurant }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <PhotoCarousel placeId={restaurant.place_id} />
        <RestaurantDetails restaurant={restaurant} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default RestaurantCard;
