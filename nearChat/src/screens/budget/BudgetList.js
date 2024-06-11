import React, { useEffect, useState } from "react";

import { View, FlatList, TouchableOpacity, Alert, Text } from "react-native";

// You can import from local files
import ButtonIcon from "../../components/ButtonIcon";

// or any pure javascript modules available in npm
import { Paragraph, Card } from "react-native-paper";
import { FontAwesome as Icon } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteBudget,
  getBudget,
  setBudget,
} from "../../hooks/redux/budgetSlice";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export function BudgetList({ setUpdateItem }) {
  //    const budget = useSelector((state) => state.budget);
  const dispatch = useDispatch();

  //fetch all budget lists
  async function getBudgetDatas() {
    try {
      var lists = [];
      const user = FIREBASE_AUTH.currentUser;
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, "users", user.uid, "budgets")
      );
      querySnapshot.forEach((doc) => {
        // Add document snapshot to the array
        lists.push({ id: doc.id, ...doc.data() });
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
      //store budget lists data
      dispatch(setBudget(lists));
    } catch (error) {
      console.error("Error retrieving documents: ", error);
    }
  }

  useEffect(() => {
    getBudgetDatas();
  }, []);
  //set to store

  const showConfirmationAlert = (id) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirm", onPress: () => handleDelete(id) },
      ],
      { cancelable: false }
    );
  };
  function handleDelete(id) {
    dispatch(deleteBudget(id));
  }

  function handleUpdateStart(item) {
    setUpdateItem(item);
  }

  // function handleToogle(item) {
  //     dispatch(toggleTodo(item));
  // }
  return (
    <View>
      {
        //get dispatch data
        useSelector((state) => state.budget) ? (
          <FlatList
            data={useSelector((state) => state.budget)}
            scrollEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <>
                  <Card
                    style={{
                      marginVertical: 2,
                      backgroundColor: "rgb(22,44,70)", //''//30,38,48
                    }}
                  >
                    <Card.Title
                      title={item.type}
                      titleStyle={{ color: "rgb(101,106,114)" }}
                      left={(props) => (
                        <Icon name="tasks" size={24} color="rgb(101,106,114)" />
                      )}
                      right={(props) => (
                        <View style={{ flexDirection: "row" }}>
                          <ButtonIcon
                            iconName="trash-o"
                            color="rgb(200,63,42)"
                            onPress={() => showConfirmationAlert(item.id)}
                          />
                          <ButtonIcon
                            iconName="pencil"
                            color="rgb(101,106,114)"
                            onPress={() => handleUpdateStart(item)}
                          />
                        </View>
                      )}
                    />
                    <Card.Content
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Paragraph>
                        <TouchableOpacity>
                          <Text style={{ color: "rgb(101,106,114)" }}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      </Paragraph>
                      <TouchableOpacity>
                        <Text style={{ color: "rgb(101,106,114)" }}>
                          {item.amount} MMK
                        </Text>
                      </TouchableOpacity>
                    </Card.Content>
                  </Card>
                </>
              );
            }}
          />
        ) : (
          <Text style={{ alignSelf: "center" }}> No budget note found!</Text>
        )
      }
    </View>
  );
}
