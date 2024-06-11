// //import liraries
// import React, { Component, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   Button,
//   TextInput,
// } from "react-native";
// import { Avatar } from "react-native-paper";
// import { useSelector } from "react-redux";
// //import { WebSocket } from "react-native-gifted-chat";
// import io from "socket.io-client";

// // create a component
// const Chat = ({ route }) => {
//   const { item } = route.params;
//   const userData = useSelector((state) => state.user.userData);

//   console.log(userData.user_id, "from chat");
//   console.log(item, "from Chat.");

//   const senderId = userData.user_id;
//   const receiverId = item.user_id;

//   const [message, setMessage] = useState("");
//   const [chatMessages, setChatMessages] = useState([]);
//   const socket = io("http://localhost:5000");

//   // useEffect(() => {
//   //   const ws = new WebSocket("ws://localhost:3000");
//   //   ws.onopen = () => {
//   //     alert("Opened");
//   //   };

//   //   ws.onmessage = (event) => {
//   //     const newMessage = JSON.parse(event.data);
//   //     setChatMessages((prevMessages) => [...prevMessages, newMessage]);
//   //   };

//   //   return () => {
//   //     ws.close();
//   //   };
//   // }, []);
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to server");
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from server");
//     });
//   }, []);

//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState("");

//   useEffect(() => {
//     socket.on("message", (message) => {
//       setMessages([...messages, message]);
//     });
//   }, [messages]);

//   const sendMessage = () => {
//     const messageData = JSON.stringify({
//       senderId,
//       receiverId,
//       messageText: messageText,
//     });
//     socket.emit("message", messageData);
//     setMessageText("");
//   };

//   // const sendMessage = () => {
//   //   const ws = new WebSocket("ws://localhost:3000");
//   //   ws.onopen = () => {
//   //     console.log("Connected to WebSocket server");
//   //     const messageData = JSON.stringify({
//   //       senderId,
//   //       receiverId,
//   //       messageText: message,
//   //     });
//   //     ws.send(messageData);
//   //     setMessage("");
//   //   };
//   // };

//   return (
//     <View style={styles.container}>
//       <View style={styles.chatItemStyle}>
//         <Avatar.Image size={70} source={{ uri: item.profileImage }} />

//         <View
//           style={{
//             flexDirection: "column",
//             alignSelf: "center",
//             marginHorizontal: 16,
//             flex: 0.5,
//             width: 200,
//           }}
//         >
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
//           <Text numberOfLines={1}>His Bio...</Text>
//         </View>

//         <View style={{ backgroundColor: "red" }}>
//           {chatMessages.map((msg, index) => (
//             <Text key={index}>{msg.message}</Text>
//           ))}
//           <TextInput
//             value={message}
//             onChangeText={(text) => setMessage(text)}
//             placeholder="Type your message"
//           />
//           <Button onPress={sendMessage} title="Send" />
//         </View>

//         <View
//           style={{
//             flexDirection: "row",
//             flex: 0.5,
//             justifyContent: "flex-end",
//             alignSelf: "center",
//           }}
//         >
//           <Text
//             style={{ textAlign: "right", color: "#004aad", fontWeight: "bold" }}
//           >
//             {item.last_online}
//           </Text>
//           {item.last_online == "Active" && (
//             <View
//               style={{
//                 width: 10,
//                 height: 10,
//                 backgroundColor: "green",
//                 borderRadius: 10,
//                 alignSelf: "center",
//                 marginLeft: 4,
//               }}
//             ></View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// // define your styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "rgb(224,240,255)",
//   },
//   chatItemStyle: {
//     padding: 8,
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "rgb(172,212,254)",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const SERVER_URL = "http://localhost:3000"; // Change this to your server URL

const Chat = ({ route }) => {
  const { item } = route.params;

  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const isFocused = useIsFocused();

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-conversation/${item.conversation_id}`
      );

      // Iterate over the array of messages
      response.data.results.map((message) => {
        console.log("message ", message.message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    } catch (error) {
      console.error("Error fetching chat lists :", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchChatMessages();
    }
  }, [isFocused]);
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const data = {
        sender: userData.user_id,
        receiver: item.user_id,
        message,
        conversationId: item.conversationId,
      };
      socket.emit("sendMessage", data);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatItemStyle}>
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
          <Text numberOfLines={1}>His Bio...</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message..."
        />
        <Feather
          name="send"
          size={32}
          color="white"
          onPress={handleSendMessage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(224,240,255)",
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    alignSelf: "flex-end",
    backgroundColor: "#004aad",
    color: "white",
    marginRight: 8,
    padding: 8,
    marginTop: 4,
  },
  chatItemStyle: {
    padding: 8,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(172,212,254)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#004aad",
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    color: "#004aad",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 48,
  },
});

export default Chat;
