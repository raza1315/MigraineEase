const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// import db:
const db = require("../../knex");

// endpoints:

// auth/
router.get("/", async (req, res) => {
  res.status(200).json(rows);
});

// auth/signup
router.post("/signup", (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error("Missing Credentials");
    }
    res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log("Error in /signup", error);
    res.status(500).json({ error: error.message });
  }
});

// exporting router:
module.exports = router;
