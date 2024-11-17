require("dotenv").config();
const express = require("express");
const router = express.Router();

// import db:
const db = require("../../knex");

// endpoints:
// /notification/appointment
router.post("/appointment", async (req, res) => {
  try {
    const {
      user_id,
      doctor_name,
      location,
      appointment_date,
      reason,
      created_at,
      reminder_sent,
    } = req.body;
    const notifications = await db("appointments").insert({
      user_id,
      doctor_name,
      location,
      appointment_date,
      reason,
      created_at,
      reminder_sent,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in /notification/appointment", error);
    res.status(500).json({ error: error.message });
  }
});

// /notification/getAppointmentsRecords
router.get("/getAppointmentsRecords/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("getAppointmentsRecords");
    const notifications = await db("appointments").select("*").where({
      user_id: userId,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in /notification/getAppointments", error);
    res.status(500).json({ error: error.message });
  }
});

// /notification/medicine-reminder
router.post("/medicine-reminder", async (req, res) => {
  try {
    const {
      user_id,
      medicine_name,
      dosage,
      start_date,
      end_date,
      created_at,
      notes,
      reminder_time,
    } = req.body;
    const notifications = await db("medications").insert({
      user_id,
      medicine_name,
      dosage,
      start_date,
      end_date,
      created_at,
      reminder_time,
      notes,
    });
    res.status(200).json({ message: "Records added successfully" });
  } catch (error) {
    console.log("Error in /notification/medicine", error);
    res.status(500).json({ error: error.message });
  }
});

// /notification/getMedicationsRecords
router.get("/getMedicationsRecords/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("getMedicationsRecords");
    const notifications = await db("medications").select("*").where({
      user_id: userId,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in /notification/getMedications", error);
    res.status(500).json({ error: error.message });
  }
});

// exporting router:
module.exports = router;
