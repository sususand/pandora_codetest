import React, { useEffect } from "react";

import { View, FlatList, TouchableOpacity, Alert, Text } from "react-native";

// You can import from local files
import Spacer from "../../components/Spacer";
import ButtonIcon from "../../components/ButtonIcon";

// or any pure javascript modules available in npm
import { Paragraph, Card } from "react-native-paper";
import { FontAwesome as Icon } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import {
  setTaskLists,
  deleteTodo,
  toggleTodo,
} from "../../hooks/redux/todosSlice";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export function TodoList({ setUpdateItem }) {
  //const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  async function fetchTaskLists() {
    try {
      var lists = [];
      const user = FIREBASE_AUTH.currentUser;
      var querySnapshot = await getDocs(
        collection(FIREBASE_DB, "users", user.uid, "tasks")
      );

      querySnapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      //store tasklists data
      dispatch(setTaskLists(lists));
    } catch (error) {
      console.log("error fetching tasks", error);
    }
  }
  useEffect(() => {
    fetchTaskLists();
  }, []);

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
    dispatch(deleteTodo(id));
  }

  function handleUpdateStart(item) {
    setUpdateItem(item);
  }

  function handleToogle(item) {
    dispatch(toggleTodo(item));
  }
  return (
    <>
      {useSelector((state) => state.todos) ? (
        <FlatList
          showsVerticalScrollIndicator
          data={useSelector((state) => state.todos)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <>
                <Card
                  style={{
                    backgroundColor: "rgb(22,44,70)", //''//30,38,48
                    marginVertical: 2,
                  }}
                >
                  <Card.Title
                    title={item.title}
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
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: "rgb(101,106,114)",
                        }}
                      >
                        {item.content}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToogle(item)}>
                      <Icon
                        name="check"
                        size={22}
                        color={item.completed ? "green" : "gray"}
                      />
                    </TouchableOpacity>
                  </Card.Content>
                </Card>
              </>
            );
          }}
        />
      ) : (
        <Text style={{ alignSelf: "center" }}> No task lists found!</Text>
      )}
    </>
  );
}
