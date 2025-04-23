import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const GroupSwipeScreen = ({ route, navigation }) => {
  const { roomCode: initialRoomCode, isHost } = route.params || {};
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [joinCode, setJoinCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(!isHost);

  const shareRoom = async () => {
    try {
      await Share.share({
        message: `Join my SwipeAndDine room!\nRoom code: ${roomCode}`,
        title: "Join SwipeAndDine Room",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const copyRoomCode = async () => {
    try {
      await Clipboard.setStringAsync(roomCode);
      Alert.alert("Success", "Room code copied to clipboard!");
    } catch (error) {
      console.error("Error copying:", error);
    }
  };

  const joinRoom = () => {
    if (joinCode.length === 6) {
      // Start swiping with the entered code
      setRoomCode(joinCode);
      setShowJoinInput(false);
    } else {
      Alert.alert("Invalid Code", "Please enter a valid 6-character room code");
    }
  };

  if (showJoinInput) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Join Room</Text>
        <TextInput
          style={styles.input}
          value={joinCode}
          onChangeText={setJoinCode}
          placeholder="Enter room code"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={joinRoom}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomCode}>Room Code: {roomCode}</Text>
        <Text style={styles.participants}>Waiting for others to join...</Text>

        <View style={styles.shareButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={shareRoom}>
            <FontAwesome name="share" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Share Room</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={copyRoomCode}>
            <FontAwesome name="copy" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Copy Code</Text>
          </TouchableOpacity>
        </View>

        {isHost && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.replace("Swiping", { roomCode })}
          >
            <Text style={styles.startButtonText}>Start Swiping</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    width: "80%",
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  roomInfo: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
  },
  roomCode: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  participants: {
    color: "#999",
    fontSize: 16,
    marginBottom: 30,
  },
  shareButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GroupSwipeScreen;
