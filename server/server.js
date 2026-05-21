// this is the same as "index.js" from mini-project-7
// src: https://github.com/FahmidaHamid/backend-with-dbms-authorization


require("dotenv").config();
if (process.env.LOCAL_DNS_FIX === "true") {
  require("./localFix.js");
 }
const express = require("express");
const cors = require("cors"); 
const { connectDB } = require("./src/config/db");

const port = process.env.PORT || 3000; //just some port

const app = express();
app.use(express.json());
app.use(cors());

// routes
const userRoutes = require("./src/routes/user.routes");
const characterRoutes = require("./src/routes/character.routes");
const notificationRoutes = require("./src/routes/notification.routes");

// connect to the database
connectDB(); 

app.use("/users", userRoutes); // use the user routes
app.use("/characters", characterRoutes); // use the character routes
app.use("/notifications", notificationRoutes); // use the notification routes

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});