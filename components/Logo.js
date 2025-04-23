import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Logo = ({ size = "small" }) => {
  const isLarge = size === "large";

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <LinearGradient
        colors={["#1a1a1a", "#333"]}
        style={[styles.logoContainer, isLarge && styles.logoContainerLarge]}
      >
        <FontAwesome name="cutlery" size={isLarge ? 32 : 20} color="#FF3B30" />
        <Text style={[styles.logoText, isLarge && styles.logoTextLarge]}>
          <Text style={styles.swipe}>Swipe</Text>
          <Text style={styles.and}>&</Text>
          <Text style={styles.dine}>Dine</Text>
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  containerLarge: {
    position: "relative",
    top: 0,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainerLarge: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoTextLarge: {
    fontSize: 28,
    marginLeft: 12,
  },
  swipe: {
    color: "#FF3B30",
  },
  and: {
    color: "#fff",
    marginHorizontal: 4,
  },
  dine: {
    color: "#4CD964",
  },
});

export default Logo;
