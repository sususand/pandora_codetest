import React, { useCallback, useState } from "react";
import {
  View,
  Alert,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";
import { addBudget, updateBudget } from "../../hooks/redux/budgetSlice";

import { Title, Card, TextInput, Button } from "react-native-paper";
import { addDoc, collection } from "firebase/firestore";

// You can import from local files
import Spacer from "../../components/Spacer";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebaseConfig";

export const AddBudget = ({ updateItem, setUpdateItem }) => {
  const [title, setTitle] = useState();
  const [type, setType] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const openPicker = useCallback(() => {
    Keyboard.dismiss();
    setShow(true);
  }, [show]);

  const hidePicker = useCallback(
    (item) => {
      !updateItem
        ? setType(item)
        : setUpdateItem({ ...updateItem, type: item });
      //setUpdateItem({ ...updateItem, type: item })
      setShow(false);
      setType(item);
    },
    [show, type]
  );

  // Add data to a collection to database
  async function saveBudgetData(budgetData) {
    setLoading(true);
    try {
      const user = FIREBASE_AUTH.currentUser;
      var data = await addDoc(
        collection(FIREBASE_DB, "users", user.uid, "budgets"),
        budgetData
      );
      dispatch(addBudget({ id: data.id, title, type, amount }));
      setLoading(false);
    } catch (error) {
      console.error("Error adding budget data: ", error);
      setLoading(false);
    }
  }

  function handleSumbit() {
    if (!updateItem) {
      if (!title) {
        Alert.alert("Info", "Please entry the title field");
        return;
      }
      if (!type) {
        Alert.alert("Info", "Please entry the content field");
        return;
      }
      if (!amount) {
        Alert.alert("Info", "Please entry the content field");
        return;
      }
      saveBudgetData({ title, type, amount });

      setTitle("");
      setType("");
      setAmount("");
      setUpdateItem();
    } else {
      dispatch(updateBudget(updateItem));
      setTitle("");
      setType("");
      setAmount("");
      setUpdateItem();
    }
  }
  //3,21,37 (22,44,70)
  return (
    <View>
      <Card contentStyle={{ backgroundColor: "rgb(22,44,70)" }}>
        <Card.Content>
          {/* {!updateItem ? (
                        <Title>Add Budget </Title>
                    ) : (
                        <Title>Edit Budget</Title>
                    )} */}

          <TextInput
            mode="outlined"
            disabled
            placeholder={show ? "" : "Type "}
            right={
              <TextInput.Icon
                onPress={openPicker}
                icon="chevron-down"
                size={20}
              />
            }
            value={!updateItem ? type : updateItem?.type}
            onChangeText={(textdata) => {
              //setType(textdata)
              //setUpdateItem({ ...updateItem, type: textdata })
              !updateItem
                ? setType(textdata)
                : setUpdateItem({ ...updateItem, type: textdata });
            }}
          />
          {show ? (
            <FlatList
              style={{
                backgroundColor: "black",
                borderWidth: 1,
                borderColor: "grey",
                elevation: 5,
                zIndex: 50,
                width: "100%",
                marginLeft: 16,
                marginTop: 70,
                position: "absolute",
              }}
              data={["Income", "Expense"]}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => hidePicker(item)}>
                  <Text style={{ padding: 8, color: "rgb(101,106,114)" }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          ) : null}

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
            placeholder="Amount"
            keyboardType="numeric"
            value={!updateItem ? amount : updateItem?.amount}
            onChangeText={(textdata) => {
              !updateItem
                ? setAmount(textdata.replace(/[^0-9]/g, ""))
                : setUpdateItem({
                    ...updateItem,
                    amount: textdata.replace(/[^0-9]/g, ""),
                  });
            }}
          />

          <Spacer />

          <Button
            style={{ borderRadius: 8, paddingVertical: 2 }}
            mode="contained"
            onPress={handleSumbit}
            loading={loading}
          >
            {!updateItem ? `Add Budget` : `Edit Budget`}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
