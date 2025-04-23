import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "./screens/MenuScreen";
import PhotoGalleryScreen from "./screens/PhotoGalleryScreen";
import RestaurantInfoScreen from "./screens/RestaurantInfoScreen";
import PhotoViewScreen from "./screens/PhotoViewScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LocationPickerScreen from "./screens/LocationPickerScreen";
import GroupSwipeScreen from "./screens/GroupSwipeScreen";
import SwipingScreen from "./screens/SwipingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhotoGallery"
          component={PhotoGalleryScreen}
          options={({ route }) => ({
            title: `${route.params.name}'s Photos`,
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
          })}
        />
        <Stack.Screen
          name="RestaurantInfo"
          component={RestaurantInfoScreen}
          options={({ route }) => ({
            title: "Restaurant Details",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
          })}
        />
        <Stack.Screen
          name="PhotoView"
          component={PhotoViewScreen}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: "Settings",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
          }}
        />
        <Stack.Screen
          name="LocationPicker"
          component={LocationPickerScreen}
          options={{
            title: "Choose Location",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
          }}
        />
        <Stack.Screen
          name="GroupSwipe"
          component={GroupSwipeScreen}
          options={{
            title: "Group Room",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#000" },
          }}
        />
        <Stack.Screen
          name="Swiping"
          component={SwipingScreen}
          options={{
            title: "Group Swiping",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#000" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
