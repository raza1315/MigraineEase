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

// /notification/medicine
router.post("/medicine", async (req, res) => {
  try {
    const {
      user_id,
      medicine_name,
      dosage,
      frequency,
      start_date,
      end_date,
      created_at,
    } = req.body;
    // const notifications = await db("medicines").insert({
    //   user_id,
    //   medicine_name,
    //   dosage,
    //   frequency,
    //   start_date,
    //   end_date,
    //   created_at,
    // });
    // res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in /notification/medicine", error);
    res.status(500).json({ error: error.message });
  }
});

// exporting router:
module.exports = router;
