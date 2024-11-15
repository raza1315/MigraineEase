require("dotenv").config();
// import modules:
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// initialize express app and setup middleware:
const app = express();
app.use(cors({ origin: true }))
app.use(bodyParser.json());

// importing routers:
const authRouter = require("./routes/auth/auth");

// set up routes:
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
})

// start the server:
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
