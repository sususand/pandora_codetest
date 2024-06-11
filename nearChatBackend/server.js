const express = require("express");
const axios = require("axios");
const geolib = require("geolib");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const multer = require("multer");
var md5 = require("md5");

const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

// Increase payload size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 3000;
const JWT_SECRET_KEY = "12898763*&#^&*#";

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "sususandi",
  password: "password",
  database: "near_chat",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Routes
// Get all users
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results, fields) => {
    if (error) {
      console.error("Error retrieving users from MySQL: ", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// SignUp Endpoint
app.post("/signup", async (req, res) => {
  const { profile_image, name, email, phone_number, address, password } =
    req.body;

  try {
    // Hash the password
    const hashedPassword = md5(password);

    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;

    // Make GET request to OpenStreetMap API
    const response = await axios.get(apiUrl);
    if (response.data[0] == null) {
      return res.status(500).json({ error: "Can't find user location." });
    }
    // Extract latitude and longitude from response
    const latitude = response.data[0].lat;
    const longitude = response.data[0].lon;

    // Insert user into database
    connection.query(
      "INSERT INTO users (name, email, phone_number, address, password, profile_image,latitude,longitude) VALUES (?, ?, ?, ?, ?, ?,?,?)",
      [
        name,
        email,
        phone_number,
        address,
        hashedPassword,
        profile_image,
        latitude,
        longitude,
      ],
      (err, results) => {
        console.log("singup error :", err);
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            console.error("Error registering user :", err);
            return res.status(409).json({ error: "User already exists." });
          }
          return res.status(500).json({ error: "Internal Server Error." });
        }
        res.status(200).json({ message: "User registered successfully." });
      }
    );
  } catch (error) {
    console.error("Error registering user :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-chats/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    connection.query(
      `SELECT DISTINCT m.conversation_id, u.name , u.user_id,u.profile_image
      FROM messages m
      JOIN users u ON m.receiver = u.user_id
      WHERE m.sender = ?;
      `,
      userId,
      (error, results) => {
        console.log("Error : ", error, "Results chat lists :", results);
        if (error) {
          console.log("error getting chat lists.", error);
          return res.status(500).json({ error: "Error getting chat lists." });
        } else {
          return res.status(200).json({ results });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

// Express route to retrieve nearby users
app.get("/nearby-users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { latitude, longitude } = req.query;

  console.log(userId, latitude, longitude, "user id nearby");
  let boundingBox;
  try {
    // Calculate bounding box or circle around the user's location within 50 meters
    const radius = 50; // in meters
    boundingBox = geolib.getBoundsOfDistance(
      { latitude: latitude, longitude: longitude },
      radius
    );

    const minLat = boundingBox[0].latitude;
    const minLon = boundingBox[0].longitude;

    const maxLat = boundingBox[1].latitude;
    const maxLon = boundingBox[1].longitude;

    // Query to select users whose latitude and longitude fall within the bounding box
    const query = `
                  SELECT *
                  FROM users
                  WHERE latitude BETWEEN ? AND ?
                  AND longitude BETWEEN ? AND ?
                  AND user_id != ?
              `;

    connection.query(
      query,
      [minLat, maxLat, minLon, maxLon, userId],
      (error, results) => {
        console.log("Error : ", error, "Results :", results);
        if (error) {
          console.log("error getting near by users .", error);
        } else {
          return res.status(200).json({ results });
        }
      }
    );
  } catch (error) {
    console.error("Error retrieving nearby users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-conversation/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const sql = `SELECT * FROM messages WHERE conversation_id = ?`;

  connection.query(sql, [conversationId], (err, results) => {
    console.log("message :::::", results);
    if (err) {
      console.error("Error getting conversation  :", err);
      return res
        .status(500)
        .json({ error: `Error getting conversation ${field}` });
    }
    return res.status(200).json({ results });
  });
});

// Endpoint to update user data
app.put("/update-user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { field, value } = req.body;
  console.log("FILED : ", field, "VALUE : ", value);
  if (!value) {
    return res.status(500).json({ error: `Error uploading  ${field}` });
  }
  try {
    if (field == "address") {
      console.log("update address ", value);
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${value}&format=json`;

      // Make GET request to OpenStreetMap API
      const response = await axios.get(apiUrl);
      // Extract latitude and longitude from response
      const latitude = response.data[0].lat;
      const longitude = response.data[0].lon;
      // Update user data in the database based on the field
      connection.query(
        `
          UPDATE users
          SET ${field} = ?,latitude = ?, longitude = ?
          WHERE user_id = ?
      `,
        [value, latitude, longitude, userId],
        (err, results) => {
          if (err) {
            console.error("Error updating user :", err);
            return res
              .status(500)
              .json({ error: `Error updating user ${field}` });
          }

          connection.query(
            `
          SELECT * FROM users
          WHERE user_id = ?
      `,
            [userId],
            (err, user) => {
              console.log("user data : ", user);
              if (err) {
                console.error("Error getting updated user :", err);
                return res
                  .status(500)
                  .json({ error: `Error getting updated user data.` });
              }
              return res.status(200).json({
                message: `User ${field} updated successfully`,
                user,
              });
            }
          );
        }
      );
    } else {
      // Update user data in the database based on the field
      connection.query(
        `
          UPDATE users
          SET ${field} = ?
          WHERE user_id = ?
      `,
        [value, userId],
        (err, results) => {
          if (err) {
            console.error("Error updating user :", err);
            return res
              .status(500)
              .json({ error: `Error updating user ${field}` });
          }
          connection.query(
            `
          SELECT * FROM users
          WHERE user_id = ?
      `,
            [userId],
            (err, user) => {
              console.log("user data ", user);
              if (err) {
                console.error("Error getting updated user :", err);
                return res
                  .status(500)
                  .json({ error: "Error getting updated user." });
              }
              return res.status(200).json({
                message: `User ${field} updated successfully`,
                user,
              });
            }
          );
        }
      );
    }
  } catch (error) {
    console.error(`Error updating user ${field}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// JWT Login Endpoint
app.post("/login", (req, res) => {
  const { phone_number, password } = req.body;
  // Check if user exists
  connection.query(
    "SELECT * FROM users WHERE phone_number = ? AND password = ?",
    [phone_number, md5(password)],
    (err, results) => {
      if (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({ error: "Internal Server Error." });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      // Generate JWT token
      const token = jwt.sign({ phone_number: phone_number }, JWT_SECRET_KEY);
      res.json({ message: "Login successful", token, userData: results });
    }
  );
});

app.get("/protected", verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Access granted", authData });
    }
  });
});

// Verify JWT Middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

// Get all chat messages
app.get("/chat/messages", (req, res) => {
  connection.query("SELECT * FROM chat_messages", (error, results, fields) => {
    if (error) {
      console.error("Error retrieving chat messages from MySQL: ", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Add a new chat message
app.post("/chat/messages", (req, res) => {
  const newMessage = req.body;
  connection.query(
    "INSERT INTO chat_messages SET ?",
    newMessage,
    (error, results, fields) => {
      if (error) {
        console.error("Error adding chat message to MySQL: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ message: "Chat message added successfully", newMessage });
    }
  );
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// When sending a message
const generateConversationId = (sender, receiver) => {
  return sender + "" + receiver;
  // Implement logic to generate or retrieve conversation_id based on sender and receiver
};
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    const { sender, receiver, message } = data;
    const conversationId = generateConversationId(sender, receiver);

    connection.query(
      "INSERT INTO messages (sender, receiver, message,conversation_id) VALUES (?, ?, ?,?)",
      [sender, receiver, message, conversationId],
      (error, results) => {
        if (error) {
          console.error("Error adding message:", error);
          return;
        }
        io.emit("message", data);
      }
    );
  });

  socket.on("disconnect", function (data) {
    console.log("user disconnected");
    socket.emit("disconnected");
  });
});
