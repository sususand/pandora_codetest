//import liraries
import React, { Component, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUserData } from "../hooks/redux/userSlice";
// create a component
const LoginScreen = ({ navigation }) => {
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const loginUser = async () => {
    if (!phone_number && !password) {
      alert("Please input phone number and password.");
      return;
    }
    try {
      let response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number, password }),
      });
      let json = await response.json();
      console.log("json : ", json);
      if (response.status != 200) {
        alert(`Error logging in ${json.error}`);
        // Save token to AsyncStorage or state for future requests
      } else {
        AsyncStorage.setItem("userData", JSON.stringify(json.userData[0]));
        dispatch(setUserData(json.userData[0]));
        AsyncStorage.setItem("token", json.token);
        setPhoneNumber("");
        setPassword("");
        navigation.navigate("Tabs");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`${error}`);
    }
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["rgb(224,240,255)", "rgb(234,247,253)"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/near_chat_logo.png")}
          style={styles.logoStyle}
        />
        <Text style={styles.titleStyle}>Near Chat</Text>

        <View style={styles.formContainer}>
          <TextInput
            textColor="#004aad"
            placeholderTextColor={"#004aad"}
            value={phone_number}
            onChangeText={(val) => setPhoneNumber(val)}
            style={styles.inputStyle}
            left={
              <TextInput.Icon
                icon={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      width: 48,

                      backgroundColor: "rgb(226,226,255)",
                    }}
                  >
                    <Image
                      source={require("../../assets/flag.png")}
                      style={styles.imageStyle}
                    />
                    {/* <Icon1 name="lock-outline" color="#004aad" size={24} /> */}
                    <Text>+95</Text>
                  </View>
                )}
                color={"#004aad"}
                size={24}
              />
            }
            placeholder="Enter your phone number"
          />
          <TextInput
            textColor="#004aad"
            placeholderTextColor={"#004aad"}
            value={password}
            secureTextEntry={true}
            onChangeText={(val) => setPassword(val)}
            style={styles.inputStyle}
            left={<TextInput.Icon icon="lock" color={"#004aad"} size={24} />}
            placeholder="Enter your password"
          />

          <View style={styles.textContainer}>
            <Text
              style={styles.textStyle}
              onPress={() => navigation.navigate("Signup")}
            >
              Create New Account?
            </Text>
            <Text
              style={styles.textStyle}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Forgot Password?
            </Text>
          </View>

          <Button
            onPress={() => {
              loginUser();
            }}
            style={styles.buttonStyle}
            mode="contained"
          >
            Log In
          </Button>
        </View>
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
  logoStyle: {
    width: 120,
    height: 120,
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
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  textStyle: {
    color: "#004aad",
    fontSize: 12,
  },
});

//make this component available to the app
export default LoginScreen;
