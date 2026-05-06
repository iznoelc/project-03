/**
 * user.routes.js
 * 
 * Routes fulfilled by user controller
 * 
 * @author Izzy Carlson
 */

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createUser, getUserByUID, updateUser } = require("../controllers/user.controller");

// test route
// router.get("/", async (req, res) => {
//   res.send("User route");
// });

// post a new user to the database
router.post("/", verifyFirebaseToken, createUser);

// get a specific user by their uid
router.get("/:uid", verifyFirebaseToken, getUserByUID);

// edit user in the database
router.patch("/:uid", verifyFirebaseToken, updateUser);

module.exports = router;

