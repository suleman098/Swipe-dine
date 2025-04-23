import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";

const MenuScreen = ({ navigation }) => {
  const createRoom = () => {
    // Generate a simple room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Change from 'Room' to 'GroupSwipe' to match the screen name in App.js
    navigation.navigate("GroupSwipe", {
      roomCode,
      isHost: true,
    });
  };

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <View style={styles.logoSection}>
        <Logo size="large" /> {/* Main large logo */}
        <Text style={styles.subtitle}>Find restaurants together</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.createRoomButton} onPress={createRoom}>
          <LinearGradient
            colors={["#FF3B30", "#FF6B52"]}
            style={styles.buttonGradient}
          >
            <FontAwesome
              name="users"
              size={30}
              color="#fff"
              style={styles.icon}
            />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Create Room</Text>
              <Text style={styles.buttonSubtext}>
                Start swiping with friends
              </Text>
            </View>
            <FontAwesome
              name="chevron-right"
              size={24}
              color="#fff"
              style={styles.arrow}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate("GroupSwipe", { isHost: false })}
        >
          <Text style={styles.joinButtonText}>Join Existing Room</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#999",
  },
  createRoomButton: {
    marginTop: 40,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    borderRadius: 15,
  },
  icon: {
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonSubtext: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 16,
    marginTop: 4,
  },
  arrow: {
    opacity: 0.6,
  },
  joinButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MenuScreen;
