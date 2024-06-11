import * as React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { DefaultTheme, PaperProvider } from "react-native-paper";

import { Provider, useDispatch } from "react-redux";
import { store } from "./src/hooks/redux/store";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ForgotPassword from "./src/screens/ForgotPassword";

import ChatList from "./src/screens/ChatList";
import Chat from "./src/screens/Chat";
import NearMe from "./src/screens/NearMe";
import Notification from "./src/screens/Notification";
import Profile from "./src/screens/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "./src/hooks/redux/userSlice";

const Tab = createBottomTabNavigator();
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#004aad",
    text: "#004aad",
  },
};
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgb(172,212,254)",
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image
            source={require("./assets/logo_white.png")}
            style={{
              width: 25,
              height: 25,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          ></Image>
        ),
        headerStyle: { backgroundColor: "#004aad" },
        tabBarShowLabel: false,
        tabBarStyle: {
          justifyContent: "center",
          backgroundColor: "#004aad",
        },
      })}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="NearMe"
        component={NearMe}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="location-sharp" size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarBadge: 1,
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {
  function MyStacks() {
    let user = null;
    const dispatch = useDispatch();
    try {
      const userDataString = AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        user = JSON.parse(userDataString);
        dispatch(setUserData(user));
      }
    } catch (error) {
      console.error("JSON parse error:", error);
    }

    console.log("app start user data: ", user);
    if (user) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={MyTabs} />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: () => (
                <Image
                  source={require("./assets/logo_white.png")}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                ></Image>
              ),
              headerStyle: { backgroundColor: "#004aad" },
            }}
          />

          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Tabs" component={MyTabs} />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: () => (
                <Image
                  source={require("./assets/logo_white.png")}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                ></Image>
              ),
              headerStyle: { backgroundColor: "#004aad" },
            }}
          />
        </Stack.Navigator>
      );
    }
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={customTheme}>
        <NavigationContainer>
          <MyStacks />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
const styles = StyleSheet.create({
  logoStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  titleStyle: {
    fontWeight: "bold",
    marginLeft: 8,
  },
});
