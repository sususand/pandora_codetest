//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Avatar } from "react-native-paper";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Zocial } from "@expo/vector-icons";
//import RNFetchBlob from "react-native-fetch-blob";

import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "../hooks/redux/userSlice";
import { useIsFocused } from "@react-navigation/native";

const Profile = ({ navigation }) => {
  const userData = useSelector((state) => state.user.userData);
  console.log(userData, "userData from profile");
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setName(userData.name);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number);
      setAddress(userData.address);
    }
  }, [isFocused]);

  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [addressEdit, setAddressEdit] = useState(false);

  const userId = userData.user_id;
  console.log("USER ID for update : ", userId);

  const handleUpdateUserData = async (field, value) => {
    try {
      console.log("field :", field, "value :", value);
      const response = await fetch(
        `http://localhost:3000/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ field, value }),
        }
      );
      const json = await response.json();

      console.log("json user : ", json.user[0]);
      if (response.status == 200) {
        alert(json.message);
        dispatch(setUserData(json.user[0]));
      } else {
        alert(json.error);
      }
    } catch (error) {
      alert(`Error updating user data.`, error.message);
    }
  };

  const pickImage = async () => {
    console.log("pick image ...");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!result.canceled) {
      console.log("image result : ", result.assets[0].base64);

      if (result.assets[0].base64 == null) {
        alert("Errro uploading profile.");
        return;
      }
      setProfile(result.assets[0].base64);
      //update profile
      handleUpdateUserData("profile_image", result.assets[0].base64);
    }
  };

  const DividerComponent = () => {
    return (
      <View
        style={{
          borderWidth: 0.5,
          borderBottomColor: "#beeffe",
        }}
      ></View>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: "rgb(224,240,255)" }}>
      <TouchableOpacity
        style={{ position: "relative", marginTop: 24 }}
        onPress={() => pickImage()}
      >
        {profile ? (
          <>
            <Image
              source={{ uri: `data:image/*;base64,${userData.profile_image}` }}
              style={[
                { width: 120, height: 120, borderRadius: 120 },
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

      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={name}
            editable={nameEdit}
            onChangeText={(val) => setName(val)}
            onBlur={() => {
              handleUpdateUserData("name", name);
              setNameEdit(false);
            }}
            style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
          />
          <FontAwesome
            name="pencil"
            size={18}
            onPress={() => setNameEdit(true)}
            color="#004aad"
            style={{ alignSelf: "center" }}
          />
        </View>

        <View style={styles.formContainer}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              paddingVertical: 8,
            }}
          >
            <Zocial name="email" size={42} color="#004aad" />
            <View
              style={{
                flexDirection: "column",
                marginLeft: 16,
                alignSelf: "center",
                flex: 0.8,
              }}
            >
              <Text style={{ color: "#004aad", marginBottom: 4 }}>Email</Text>
              <TextInput
                value={email}
                editable={emailEdit}
                autoCapitalize={false}
                keyboardType="email-address"
                onChangeText={(val) => setEmail(val)}
                onBlur={() => {
                  handleUpdateUserData("email", email);
                  setEmailEdit(false);
                }}
              />
            </View>

            <FontAwesome
              name="pencil"
              size={18}
              color="#004aad"
              onPress={() => setEmailEdit(true)}
              style={{
                flex: 0.2,
                justifyContent: "flex-end",
                alignSelf: "center",
              }}
            />
          </View>

          <DividerComponent />

          <View style={{ flexDirection: "row", paddingVertical: 8 }}>
            <FontAwesome6 name="phone" size={42} color="#004aad" />

            <View
              style={{
                flexDirection: "column",
                marginLeft: 16,
                alignSelf: "center",
                flex: 0.8,
              }}
            >
              <Text style={{ color: "#004aad", marginBottom: 4 }}>
                Phone Number
              </Text>
              <TextInput
                value={phone_number}
                editable={phoneEdit}
                onChangeText={(val) => setPhoneNumber(val)}
                onBlur={() => {
                  handleUpdateUserData("phone_number", phone_number);
                  setPhoneEdit(false);
                }}
              />
            </View>
            <FontAwesome
              name="pencil"
              size={18}
              color="#004aad"
              onPress={() => setPhoneEdit(true)}
              style={{
                flex: 0.2,
                justifyContent: "flex-end",
                alignSelf: "center",
              }}
            />
          </View>
          <DividerComponent />

          <View
            style={{
              flexDirection: "row",
              paddingVertical: 8,
              marginBottom: 16,
            }}
          >
            <Ionicons name="location-sharp" size={42} color={"#004aad"} />
            <View
              style={{
                flexDirection: "column",
                marginLeft: 16,
                alignSelf: "center",
                flex: 0.8,
              }}
            >
              <Text style={{ color: "#004aad", marginBottom: 4 }}>Address</Text>

              <TextInput
                value={address}
                editable={addressEdit}
                onChangeText={(val) => setAddress(val)}
                onBlur={() => {
                  handleUpdateUserData("address", address);
                  setAddressEdit(false);
                }}
              />
            </View>
            <FontAwesome
              name="pencil"
              size={18}
              color="#004aad"
              onPress={() => {
                setAddressEdit(true);
              }}
              style={{
                flex: 0.2,
                justifyContent: "flex-end",
                alignSelf: "center",
              }}
            />
          </View>

          <Button
            onPress={() => {
              AsyncStorage.clear();

              navigation.navigate("Login");
            }}
            style={styles.buttonStyle}
            mode="contained"
          >
            Log Out
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
    resizeMode: "cover",
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
  },
  inputStyle: {
    backgroundColor: "#ffffff",
    color: "#004aad",
    marginVertical: 4,
  },
  buttonStyle: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgb(227,13,43)",
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
export default Profile;
