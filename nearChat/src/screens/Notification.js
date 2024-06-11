//import liraries
import React, { Component } from "react";
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

// create a component
const Notification = ({ navigation }) => {
  const chatLists = [
    {
      name: "Earn",
      content: "is near you.",
      noti_time: "15 mins ago",
      readFlag: false,
    },
    {
      name: "Steve",
      content: "  is near you.",
      noti_time: "15 mins ago",
      readFlag: true,
    },
    {
      name: "Steve",
      content: "send you a message.",
      noti_time: "15 mins ago",
      readFlag: true,
    },
  ];
  const renderChat = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.chatItemStyle,
          {
            backgroundColor: item.readFlag
              ? "rgb(172,212,254)"
              : "rgb(237,249,254)",
          },
        ]}
        onPress={() => {
          navigation.navigate("Chat", { item });
        }}
      >
        <Ionicons name="notifications" size={48} color={"#004aad"} />

        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
            marginHorizontal: 16,
            flex: 0.5,
            width: 200,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ fontSize: 16, fontWeight: "bold", color: "#004aad" }}
          >
            {item.name}{" "}
            <Text numberOfLines={1} style={{ fontSize: 14, color: "black" }}>
              {item.content}
            </Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 0.5,
            justifyContent: "flex-end",
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#004aad" }}>
            {item.noti_time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={chatLists} renderItem={renderChat} />
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
    margin: 8,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
  },
});

//make this component available to the app
export default Notification;
