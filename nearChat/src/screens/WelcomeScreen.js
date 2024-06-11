//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-paper";

// create a component
const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["rgb(224,240,255)", "rgb(234,247,253)"]}
      style={styles.container}
    >
      <Image
        source={require("../../assets/near_chat_logo.png")}
        style={styles.logoStyle}
      />
      <Text style={styles.titleStyle}>Near Chat</Text>

      <Button
        style={styles.buttonStyle}
        mode="contained"
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        Log In
      </Button>
      <Button
        style={styles.buttonStyle}
        mode="contained"
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        Sign Up
      </Button>
    </LinearGradient>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
  },
  buttonStyle: {
    marginVertical: 4,
    width: 130,
    borderRadius: 8,
  },
});

//make this component available to the app
export default WelcomeScreen;
