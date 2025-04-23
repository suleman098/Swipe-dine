import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import Swiper from "react-native-deck-swiper";
import { GOOGLE_API_KEY } from "../config";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const SwipingScreen = ({ route, navigation }) => {
  const { roomCode } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const swipeProgress = useRef(new Animated.Value(0)).current;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1500); // Start with 1.5km
  const [totalFetched, setTotalFetched] = useState(0);
  const swiperRef = useRef(null);

  const fetchRestaurants = async (radius = searchRadius) => {
    try {
      setLoading(true);
      let locationToUse = currentLocation;

      if (!locationToUse) {
        // Get location settings
        const settings = await AsyncStorage.getItem("locationSettings");
        const { useCurrentLocation } = JSON.parse(
          settings || '{"useCurrentLocation":true}'
        );

        if (useCurrentLocation) {
          const location = await Location.getCurrentPositionAsync({});
          locationToUse = location.coords;
        } else {
          const customLocation = await AsyncStorage.getItem("customLocation");
          locationToUse = customLocation
            ? JSON.parse(customLocation)
            : (await Location.getCurrentPositionAsync({})).coords;
        }
        setCurrentLocation(locationToUse);
      }

      console.log(`Fetching restaurants with radius: ${radius}m`);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationToUse.latitude},${locationToUse.longitude}&radius=${radius}&type=restaurant&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();
      if (data.status === "OK") {
        const newRestaurants = data.results.filter(
          (newRest) =>
            !restaurants.some(
              (existingRest) => existingRest.place_id === newRest.place_id
            )
        );

        console.log(`Found ${newRestaurants.length} new restaurants`);

        if (newRestaurants.length > 0) {
          // Reset the swiper and update restaurants
          setRestaurants((prevRestaurants) => {
            const updatedRestaurants = [...prevRestaurants, ...newRestaurants];
            console.log(`Total restaurants: ${updatedRestaurants.length}`);
            return updatedRestaurants;
          });
          setSearchRadius(radius);

          // Reset swiper to first card if it exists
          if (swiperRef.current) {
            swiperRef.current.jumpToCardIndex(0);
          }
        } else if (radius < 5000) {
          // If no new restaurants found and radius is less than 5km, try with larger radius
          console.log("No new restaurants found, increasing radius");
          await fetchRestaurants(radius + 1500);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      Alert.alert("Error", "Failed to load more restaurants");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Listen for location changes
  useEffect(() => {
    const checkLocationChanges = async () => {
      try {
        const settings = await AsyncStorage.getItem("locationSettings");
        const customLocation = await AsyncStorage.getItem("customLocation");

        // Compare with current location and refresh if different
        if (currentLocation) {
          const { useCurrentLocation } = JSON.parse(
            settings || '{"useCurrentLocation":true}'
          );

          if (useCurrentLocation) {
            const newLocation = await Location.getCurrentPositionAsync({});
            const significantChange =
              Math.abs(newLocation.coords.latitude - currentLocation.latitude) >
                0.01 ||
              Math.abs(
                newLocation.coords.longitude - currentLocation.longitude
              ) > 0.01;

            if (significantChange) {
              fetchRestaurants();
            }
          } else if (customLocation) {
            const customData = JSON.parse(customLocation);
            const locationChanged =
              customData.latitude !== currentLocation.latitude ||
              customData.longitude !== currentLocation.longitude;

            if (locationChanged) {
              fetchRestaurants();
            }
          }
        }
      } catch (error) {
        console.error("Error checking location changes:", error);
      }
    };

    // Check for location changes when screen is focused
    const unsubscribe = navigation.addListener("focus", checkLocationChanges);
    return unsubscribe;
  }, [navigation, currentLocation]);

  const renderCornerIndicators = () => (
    <>
      <Animated.View
        style={[
          styles.cornerIndicator,
          styles.likeIndicator,
          {
            opacity: swipeProgress.interpolate({
              inputRange: [-50, 0, 50, 100],
              outputRange: [0, 0, 0.5, 1],
            }),
          },
        ]}
      >
        <FontAwesome name="check" size={40} color="#4CD964" />
      </Animated.View>
      <Animated.View
        style={[
          styles.cornerIndicator,
          styles.nopeIndicator,
          {
            opacity: swipeProgress.interpolate({
              inputRange: [-100, -50, 0, 50],
              outputRange: [1, 0.5, 0, 0],
            }),
          },
        ]}
      >
        <FontAwesome name="times" size={40} color="#FF3B30" />
      </Animated.View>
    </>
  );

  const handleOutOfCards = () => {
    Alert.alert(
      "Load More Restaurants?",
      "Would you like to search in a wider area?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const newRadius = searchRadius + 1500;
            console.log(`Loading more restaurants with radius: ${newRadius}m`);
            await fetchRestaurants(newRadius);
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {renderCornerIndicators()}
      {restaurants.length > 0 ? (
        <Swiper
          ref={swiperRef}
          key={restaurants.length} // Add key to force re-render when restaurants update
          cards={restaurants}
          renderCard={(restaurant) => (
            <RestaurantCard
              restaurant={restaurant}
              swipeProgress={swipeProgress}
            />
          )}
          cardIndex={0}
          backgroundColor="#000"
          stackSize={3}
          stackScale={6}
          stackSeparation={14}
          animateOverlayLabelsOpacity
          animateCardOpacity
          verticalSwipe={false}
          horizontalSwipe={true}
          swipeAnimationDuration={350}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.cardStyle}
          inputRotationRange={[-width / 2, 0, width / 2]}
          outputRotationRange={["-10deg", "0deg", "10deg"]}
          marginTop={0}
          marginBottom={0}
          onSwipedRight={(cardIndex) => {
            console.log("Liked:", restaurants[cardIndex].name);
            swipeProgress.setValue(0);
          }}
          onSwipedLeft={(cardIndex) => {
            console.log("Disliked:", restaurants[cardIndex].name);
            swipeProgress.setValue(0);
          }}
          onSwiping={(x) => {
            Animated.spring(swipeProgress, {
              toValue: x,
              useNativeDriver: true,
              friction: 8,
            }).start();
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "#FF3B30",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "#4CD964",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginRight: 30,
                },
              },
            },
          }}
          onSwipedAll={() => {
            console.log("All cards swiped");
            handleOutOfCards();
          }}
          showSecondCard
          infinite={false}
          cardVerticalMargin={20}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.noRestaurantsText}>
            {loading ? "Loading restaurants..." : "No restaurants found"}
          </Text>
          {!loading && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchRestaurants(searchRadius + 1500)}
            >
              <Text style={styles.retryButtonText}>Search Wider Area</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  swiperContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  cornerIndicator: {
    position: "absolute",
    top: 50,
    padding: 15,
    borderRadius: 30,
    zIndex: 3,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  likeIndicator: {
    right: 20,
  },
  nopeIndicator: {
    left: 20,
  },
  overlayLabel: {
    fontSize: 45,
    fontWeight: "bold",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
  },
  overlayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    flex: 1,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  noRestaurantsText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SwipingScreen;
