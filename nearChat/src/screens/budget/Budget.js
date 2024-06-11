import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";

// You can import from local files
import Spacer from "../../components/Spacer";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

import { BudgetList } from "./BudgetList";
import { AddBudget } from "./AddBudget";

export const Budget = () => {
  // variable to save edit item
  const [updateItem, setUpdateItem] = useState();

  return (
    <View style={styles.container}>
      <Spacer />

      <AddBudget updateItem={updateItem} setUpdateItem={setUpdateItem} />

      <Spacer />
      <View style={{ flex: 1, width: "100%" }}>
        <BudgetList updateItem={updateItem} setUpdateItem={setUpdateItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#ecf0f1',
    backgroundColor: "rgb(3,21,37)", //''//42,49,60
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
