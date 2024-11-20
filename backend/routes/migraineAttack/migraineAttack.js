const express = require("express");
const router = express.Router();
const db = require("../../knex");

// endpoints:
// /migraineAttack/submit
router.post("/submit", async (req, res) => {
  try {
    const {
      userId,
      startTime,
      endTime,
      intensity,
      selectedAreas,
      medsTaken,
      reliefMethods,
    } = req.body;
    const migraineAttack = await db("migraine_attacks").insert({
      user_id: userId,
      start_time: startTime,
      end_time: endTime,
      intensity,
      pain_parts: selectedAreas,
      medicines: medsTaken,
      relief_methods: reliefMethods,
    });
    res.status(200).json({ message: "Records added successfully" });
  } catch (error) {
    console.log("Error in /migraineAttack/submit", error);
    res.status(500).json({ error: error.message });
  }
});

// /migraineAttack/getMigraineAttacks
router.get("/getMigraineAttacks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const migraineAttacks = await db("migraine_attacks").where({
      user_id: userId,
    });
    res.status(200).json(migraineAttacks);
  } catch (error) {
    console.log("Error in /migraineAttack/getMigraineAttacks", error);
    res.status(500).json({ error: error.message });
  }
});
//export router:
module.exports = router;
