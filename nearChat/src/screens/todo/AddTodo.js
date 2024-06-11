import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { addTodo, updateTodo } from "../../hooks/redux/todosSlice";

import { Title, Card, TextInput, Button } from "react-native-paper";

// You can import from local files
import Spacer from "../../components/Spacer";
import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebaseConfig";

export const AddTodo = ({ updateItem, setUpdateItem }) => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  //save todo task to database
  async function addTaskData(taskData) {
    setLoading(true);

    try {
      const user = FIREBASE_AUTH.currentUser;
      const task = await addDoc(
        collection(FIREBASE_DB, "users", user.uid, "tasks"),
        taskData
      );
      dispatch(addTodo({ id: task.id, title, content }));
      setLoading(false);
    } catch (error) {
      console.error("Error adding task .", error);
      setLoading(false);
    }

    //var task = await addDoc(collection(FIREBASE_DB, "tasks"), taskData);
  }
  function handleSumbit() {
    if (!updateItem) {
      if (!title) {
        Alert.alert("Info", "Please entry the title field");
        return;
      }
      if (!content) {
        Alert.alert("Info", "Please entry the content field");
        return;
      }
      addTaskData({ title, content });

      setTitle("");
      setContent("");
      setUpdateItem();
    } else {
      dispatch(updateTodo(updateItem));
      setTitle("");
      setContent("");
      setUpdateItem();
    }
  }

  return (
    <View>
      <Card
        contentStyle={{
          backgroundColor: "rgb(22,44,70)", //''//30,38,48
        }}
      >
        <Card.Content>
          {/* {!updateItem ? (
            <Title style={{ color: "white" }}>Add Task</Title>
          ) : (
            <Title style={{ color: "white" }}>Edit Task</Title>
          )} */}

          <TextInput
            mode="outlined"
            placeholder="Title"
            value={!updateItem ? title : updateItem?.title}
            onChangeText={(textdata) => {
              !updateItem
                ? setTitle(textdata)
                : setUpdateItem({ ...updateItem, title: textdata });
            }}
          />
          <TextInput
            mode="outlined"
            placeholder="Content"
            value={!updateItem ? content : updateItem?.content}
            onChangeText={(textdata) => {
              !updateItem
                ? setContent(textdata)
                : setUpdateItem({ ...updateItem, content: textdata });
            }}
          />

          <Spacer />

          <Button
            style={{ borderRadius: 8, paddingVertical: 2 }}
            mode="contained"
            onPress={handleSumbit}
            loading={loading}
          >
            {!updateItem ? `Add Task` : `Edit Task`}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
