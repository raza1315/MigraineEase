require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();
// import db:
const db = require("../../knex");

// cloudinary configuration:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "migraineease_users",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const upload = multer({ storage: storage });

// endpoints:
// auth/
router.get("/", async (req, res) => {
  res.status(200).json(rows);
});

// auth/signup
router.post("/signup", upload.single("image"), async (req, res) => {
  const trx = await db.transaction();
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      trx.rollback();
      return res.status(404).json({ error: "Missing Credentials" });
    }
    const existingmail = await trx("users").where({ email }).first();
    if (existingmail) {
      console.log("already exists");
      trx.rollback();
      return res.status(200).json({ error: "Email already exists" });
    }
    const imageUrl = req.file?.path;
    console.log(imageUrl);

    const [user] = await trx("users")
      .insert({
        username,
        email,
        password,
        image_url: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("user_id");
    trx.commit();
    res
      .status(201)
      .json({ message: "Signup successful", userId: user.user_id });
  } catch (error) {
    console.log("Error in /signup", error);
    trx.rollback();
    res.status(500).json({ error: error.message });
  }
});

// auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ error: "Missing Credentials" });
    }
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ error: "User not Signed up" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res
      .status(200)
      .json({ message: "Sign In Successful", userId: user.user_id });
  } catch (error) {
    console.log("Error in /signin", error);
    res.status(500).json({ error: error.message });
  }
});

// /auth/profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db("users").where({ user_id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in /profile", error);
    res.status(500).json({ error: error.message });
  }
});

// exporting router:
module.exports = router;
