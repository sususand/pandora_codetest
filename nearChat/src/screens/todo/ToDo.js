import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import Constants from "expo-constants";

// You can import from local files
import Spacer from "../../components/Spacer";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

import { TodoList } from "./TodoList";
import { AddTodo } from "./AddTodo";

export const ToDo = () => {
  // variable to save edit item
  const [updateItem, setUpdateItem] = useState();

  return (
    <View style={styles.container}>
      <AddTodo updateItem={updateItem} setUpdateItem={setUpdateItem} />
      <Spacer />

      <TodoList updateItem={updateItem} setUpdateItem={setUpdateItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "rgb(3,21,37)", //''//
    //backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
