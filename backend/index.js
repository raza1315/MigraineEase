require("dotenv").config();
// import modules:
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
// import db:
const db = require("./knex");
// initialize express app and setup middleware:
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// importing routers:
const authRouter = require("./routes/auth/auth");
const notificationRouter = require("./routes/notification/notification");
const chatRouter = require("./routes/chat/chat");
const migraineAttackRouter = require("./routes/migraineAttack/migraineAttack");

// set up routes:
app.use("/auth", authRouter);
app.use("/notification", notificationRouter);
app.use("/chat", chatRouter);
app.use("/migraineAttack", migraineAttackRouter);
app.get("/", (req, res) => {
  res.status(200).json("Server is Running");
});

// start the server:
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// initialize socket.io:
const io = socketIO(server);

// handle socket.io events:
io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("serverListener", async (data) => {
    console.log(
      "Message : ",
      data.message,
      "send by : ",
      data.senderId,
      "To : ",
      data.receiverId
    );
    const payload = {
      message: data.message,
      sender: data.senderId,
      receiver: data.receiverId,
      timeStamp: new Date(),
    };
    await db("chats").insert({
      message: data.message,
      sender_id: data.senderId,
      receiver_id: data.receiverId,
      sent_at: new Date(),
    });
    socket.broadcast.emit("clientListener", payload);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});
