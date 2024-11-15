// const express = require("express");
// const { OAuth2Client } = require("google-auth-library");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const app = express();
// app.use(cors());
// app.use(cookieParser());
// // Set EJS as the view engine
// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, './'));
// // const db = require('../knex.js'); // Assume your knex configuration is here

// // Replace these values with your Google OAuth 2.0 credentials
// const CLIENT_ID =
//   "186723869910-vmsr3158lpo874p1nb79pu7n9ak218li.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";
// const REDIRECT_URI =
//   "https://62d1-103-28-253-234.ngrok-free.app/auth/google/callback";
// const JWT_SECRET = "your_jwt_secret_key"; // Your secret key for JWT
// const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// // Step 1: Redirect to Google's OAuth 2.0 server
// app.get("/auth/google", (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline", // to get a refresh token
//     scope: ["profile", "email"],
//   });
//   res.redirect(authUrl);
// });

// // Step 2: Google redirects back with the authorization code
// app.get("/auth/google/callback", async (req, res) => {
//   console.log("/auth/google/callback");
//   const code = req.query.code;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     console.log(tokens);
//     const userInfoResponse = await axios.get(
//       "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
//       { headers: { Authorization: `Bearer ${tokens.access_token}` } }
//     );
//     const userInfo = userInfoResponse.data;

//     // Step 7: Generate JWT token
//     const token = jwt.sign(
//       {
//         // email: userInfo.email,
//         name: userInfo.name,
//         access_token: tokens.access_token,
//       },
//       JWT_SECRET,
//       { expiresIn: "10s" }
//     ); // Token expires in 1 min

//     // Set JWT token in a cookie
//     res.cookie("jwt", token, { httpOnly: true, secure: false }); // Set secure: true in production
//     // res.redirect(`oauth2://callback?token=${token}`);
//     console.log("redirected again to app");

//     // After successful login, redirect to the page that closes the window
//     res.render("close-window");
//   } catch (error) {
//     console.error(
//       "Error during OAuth callback:",
//       error.response?.data || error.message
//     );
//     res.status(500).send("Authentication failed");
//   }
// });

// // Start the server
// app.listen(4000, () => {
//   console.log("Server running on http://localhost:4000");
// });