//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, TextInput } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

// create a component
const ForgotPassword = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["rgb(224,240,255)", "rgb(234,247,253)"]}
      style={{ flex: 1 }}
    >
      <Entypo
        name="chevron-left"
        size={32}
        onPress={() => navigation.goBack()}
        color="#004aad"
        style={styles.leftIconStyle}
      />
      <View style={styles.container}>
        <Image
          source={require("../../assets/lock_image.png")}
          style={styles.logoStyle}
        />

        <Text style={styles.titleStyle}>Forgot Password?</Text>
        <Text style={styles.textStyle}>Don't worry. We'll help you</Text>
        <Text style={styles.textStyle}>recover your account</Text>

        <Button
          onPress={() => {
            Linking.openURL(`tel:09951402302`);
          }}
          style={styles.buttonStyle}
          mode="contained"
        >
          Call Us Now
        </Button>
      </View>
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
  leftIconStyle: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  logoStyle: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: "contain",
  },
  imageStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#004aad",
  },
  formContainer: {
    width: "95%",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgb(172,212,254)",
  },
  inputStyle: {
    backgroundColor: "#ffffff",
    color: "#004aad",
    marginVertical: 4,
  },
  buttonStyle: {
    marginVertical: 4,
    width: 130,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 24,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  textStyle: {
    color: "#004aad",
    fontSize: 16,
  },
});

//make this component available to the app
export default ForgotPassword;
