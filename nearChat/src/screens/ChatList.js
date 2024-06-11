//import liraries
import { useIsFocused } from "@react-navigation/native";
import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setChatLists } from "../hooks/redux/userSlice";
// create a component
const ChatList = ({ navigation }) => {
  const userData = useSelector((state) => state.user.userData);
  console.log("Chat user data : ", userData);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const fetchChatLists = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-chats/${userData.user_id}`
      );
      dispatch(setChatLists(response.data.results));
      console.log("chst list sss!!!!: ", response.data.results);
    } catch (error) {
      console.error("Error fetching chat lists :", error);
    }
  };

  const chatlists = useSelector((state) => state.user.chatLists);
  console.log("Chat list s from chat list :", chatlists);
  useEffect(() => {
    if (isFocused) fetchChatLists();
  }, [isFocused]);

  const chatList = [
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Olivia",
      message: "Hello",
      last_online: "last 2 day",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/5D8100AD-5E34-454E-8297-230CE0A8A69B.jpg",
      name: "Ava",
      message: "Hello this is the first time of our vacation.",
      last_online: "Active",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Leo",
      message: "Hello this is the first time of our vacation.",
      last_online: "2 mins ago",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Mia",
      message: "Hello this is the first time of our vacation.",
      last_online: "last 2 day",
    },
    {
      profileImage:
        "file:///Users/mba132582/Library/Developer/CoreSimulator/Devices/265288D4-84D4-4BEC-A66A-C786155CE700/data/Containers/Data/Application/D66CFE08-3629-4997-AB39-8D3DC73D79B1/Library/Caches/ExponentExperienceData/@julietdiana/budgetrn/ImagePicker/332E6185-1BF3-4384-895D-A2B7EF59D759.jpg",
      name: "Sam",
      message: "Hello this is the first time of our vacation.",
      last_online: "last 2 day",
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
          <Text numberOfLines={1}>His bio.</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 0.5,
            justifyContent: "flex-end",
            alignSelf: "center",
          }}
        >
          <Text
            style={{ textAlign: "right", color: "#004aad", fontWeight: "bold" }}
          >
            {item.last_online}
          </Text>
          {item.last_online == "Active" && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                alignSelf: "center",
                marginLeft: 4,
              }}
            ></View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      {chatlists && chatlists.length > 0 ? (
        <FlatList
          data={chatlists}
          renderItem={renderChat}
          style={styles.container}
        />
      ) : (
        <Text
          style={{
            color: "#004aad",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          There is no chat lists.
        </Text>
      )}
    </>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgb(172,212,254)",
  },
});

//make this component available to the app
export default ChatList;
