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
const { deleteUser, createUser, getUserByUID, getAllUsers, updateUser, checkUsernameAvailability } = require("../controllers/user.controller");

// test route
// router.get("/", async (req, res) => {
//   res.send("User route");
// });

// delete a user based on their uid
router.delete("/:uid", verifyFirebaseToken, deleteUser);

// post a new user to the database
router.post("/", verifyFirebaseToken, createUser);

router.get("/check-username", checkUsernameAvailability)

// get a specific user by their uid
router.get("/:uid", verifyFirebaseToken, getUserByUID);

//get all users
router.get("/", getAllUsers);

// edit user in the database
router.patch("/:uid", verifyFirebaseToken, updateUser);

module.exports = router;

