const express = require("express");
const router = express.Router();
const db = require("../../knex");

// endpoints:
// /chat/
router.get("/", async (req, res) => {
  res.status(200).json({ message: "chat route" });
});

// /chat/getUsers
router.get("/getUsers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // all the users except the logged in user
    const users = await db("users").whereNot({ user_id: userId });
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in /chat/getUsers", error);
    res.status(500).json({ error: error.message });
  }
});

// export router:

module.exports = router;
