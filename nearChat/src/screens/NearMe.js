//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNearLists } from "../hooks/redux/userSlice";
import { useIsFocused } from "@react-navigation/native";

// create a component
const NearMe = ({ navigation }) => {
  const dispatch = useDispatch();
  const nearUsers = useSelector((state) => state.user.nearLists);
  const userData = useSelector((state) => state.user.userData);

  const fetchNearbyUsers = async (userId) => {
    const latitude = "16.84507360";
    const longitude = "96.12249790";
    try {
      const response = await axios.get(
        `http://localhost:3000/nearby-users/${userId}?latitude=${latitude}&longitude=${longitude}`
      );
      dispatch(setNearLists(response.data.results));
      console.log("near list : ", response.data.results);
    } catch (error) {
      console.error("Error fetching nearby users:", error);
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchNearbyUsers(userData.user_id);
  }, [isFocused]);

  const chatLists = [
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Olivia",
      message: "Hello",
      last_online: "last 2 day",
      bio_msg: "His Bio",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/5D8100AD-5E34-454E-8297-230CE0A8A69B.jpg",
      name: "Ava",
      message: "Hello this is the first time of our vacation.",
      last_online: "Active",
      bio_msg: "His Bio",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Leo",
      message: "Hello this is the first time of our vacation.",
      last_online: "2 mins ago",
      bio_msg: "His Bio",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Mia",
      message: "Hello this is the first time of our vacation.",
      last_online: "last 2 day",
      bio_msg: "His Bio",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Sam",
      message: "Hello this is the first time of our vacation.",
      last_online: "last 2 day",
      bio_msg: "His Bio",
    },
  ];
  const renderChat = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatItemStyle}
        onPress={() => {
          navigation.navigate("Chat", { item });
        }}
      >
        <Avatar.Image
          size={70}
          source={{ uri: `data:image/*;base64,${item.profile_image}` }}
        />

        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
            marginHorizontal: 16,
            flex: 0.5,
            width: 200,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
          {/* <Text numberOfLines={1}>{item.bio_msg}</Text> */}

          <Text numberOfLines={1}>His Bio</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 0.5,
            justifyContent: "flex-end",
            alignSelf: "center",
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color={"#004aad"} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#004aad",
          marginTop: 8,
        }}
      >
        ** People within 50 meters of you **
      </Text>
      <View>
        <Image
          source={require("../../assets/locations.jpg")}
          style={{
            marginHorizontal: 8,
            marginTop: 8,
            resizeMode: "cover",
            height: 70,
            width: "auto",
            borderRadius: 8,
          }}
        />
      </View>
      {nearUsers && nearUsers.length > 0 ? (
        <FlatList data={nearUsers} renderItem={renderChat} />
      ) : (
        <Text style={{ alignSelf: "center", marginTop: 24, color: "#004aad" }}>
          There is no user near you.
        </Text>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(224,240,255)",
  },
  chatItemStyle: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
  },
});

//make this component available to the app
export default NearMe;
