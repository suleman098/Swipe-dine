import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const RestaurantDetails = ({ restaurant }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.info}>
        ⭐ {restaurant.rating || "N/A"} • {restaurant.user_ratings_total || 0}{" "}
        reviews
      </Text>
      <Text style={styles.address}>{restaurant.vicinity}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RestaurantInfo", { restaurant })}
        >
          <FontAwesome name="info-circle" size={16} color="#000" />
          <Text style={styles.buttonText}>More Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Settings")}
        >
          <FontAwesome name="cog" size={16} color="#000" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default RestaurantDetails;
