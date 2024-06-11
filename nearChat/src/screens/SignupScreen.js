//import liraries
import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, TextInput, Avatar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const SignupScreen = ({ navigation }) => {
  const [profile_image, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpUser = async () => {
    if (
      !profile_image &&
      !name &&
      !email &&
      !phone_number &&
      !address &&
      !password
    ) {
      alert("Please input all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password does not match!");
      return;
    }

    try {
      // const binaryImageData = await fetch(profile_image);
      // const binaryImageBlob = await binaryImageData.blob();
      // const binaryImageArrayBuffer = await binaryImageBlob.arrayBuffer();
      // const binaryImageDataArray = Array.from(
      //   new Uint8Array(binaryImageArrayBuffer)
      // );

      let response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_image,
          name,
          email,
          phone_number,
          address,
          password,
        }),
      });

      let json = await response.json();
      console.log("JSOON : ", json);
      if (response.status == 200) {
        alert("User registered successfully.");
        navigation.navigate("Login");
      } else {
        alert(`Error : ${json.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!result.canceled) {
      console.log("image result : ", result.assets[0].base64);

      setProfile(result.assets[0].base64);
      //update profile
      handleUpdateUserData("profile_image", profile);
    }
  };

  const SignupHeaderLeft = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          paddingHorizontal: 16,
          paddingTop: 32,
        }}
      >
        <Image
          source={require("../../assets/near_chat_logo.png")}
          style={styles.logoStyle}
        />
        <Text style={styles.titleStyle}>Near Chat</Text>
      </View>
    );
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "rgb(224,240,255)" }}
    >
      <SignupHeaderLeft />

      <View>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => pickImage()}
        >
          {profile_image ? (
            <>
              <Image
                source={{ uri: `data:image/*;base64,${profile_image}` }}
                style={[
                  {
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "red",
                  },
                  styles.profileStyle,
                ]}
              />

              <FontAwesome
                name="plus"
                size={28}
                color="#rgb(253,179,85)"
                style={{ position: "absolute", top: 94, left: 220 }}
              />
            </>
          ) : (
            <>
              <FontAwesome
                name="user-circle"
                size={120}
                color="#004aad"
                style={styles.profileStyle}
              />
              <FontAwesome
                name="plus"
                size={28}
                color="#rgb(253,179,85)"
                style={{ position: "absolute", top: 97, left: 220 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            textColor="#004aad"
            placeholderTextColor={"#004aad"}
            value={name}
            autoCapitalize={false}
            autoCorrect={false}
            onChangeText={(val) => setName(val)}
            style={styles.inputStyle}
            left={<TextInput.Icon icon="account" color={"#004aad"} size={24} />}
            placeholder="Enter your name"
          />
          <TextInput
            textColor="#004aad"
            placeholderTextColor={"#004aad"}
            value={email}
            autoCapitalize={false}
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(val) => setEmail(val)}
            style={styles.inputStyle}
            left={<TextInput.Icon icon="email" color={"#004aad"} size={24} />}
            placeholder="Enter your email"
          />
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
            value={address}
            onChangeText={(val) => setAddress(val)}
            style={styles.inputStyle}
            left={
              <TextInput.Icon icon="map-marker" color={"#004aad"} size={24} />
            }
            placeholder="Enter your address"
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
          <Text style={[styles.textStyle, { fontSize: 11, marginVertical: 4 }]}>
            Password must be 8-15 characters with at least 1 letter & 1 number
          </Text>
          <TextInput
            textColor="#004aad"
            placeholderTextColor={"#004aad"}
            value={confirmPassword}
            secureTextEntry={true}
            onChangeText={(val) => setConfirmPassword(val)}
            style={styles.inputStyle}
            left={<TextInput.Icon icon="lock" color={"#004aad"} size={24} />}
            placeholder="Enter your confirm password"
          />

          <Text
            style={[
              styles.textStyle,
              {
                alignSelf: "center",
                marginVertical: 16,
              },
            ]}
          >
            Already have an account?
            <Text
              style={{
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("Login")}
            >
              Log In Here
            </Text>
          </Text>

          <Button
            onPress={() => {
              signUpUser();
              //navigation.navigate("Tabs");
            }}
            style={styles.buttonStyle}
            mode="contained"
          >
            Sign Up
          </Button>
        </View>
      </View>
    </ScrollView>
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
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  profileStyle: {
    resizeMode: "cover",
    alignSelf: "center",
    marginBottom: 24,
  },
  imageStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    marginLeft: 4,
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
export default SignupScreen;
