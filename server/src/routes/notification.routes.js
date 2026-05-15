/**
 * notification.routes.js
 * 
 * Routes fulfilled by notification controller
 * 
 * @author Izzy Carlson
 */

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { postNotification } = require("../controllers/notification.controller");

// post a new notification to the database
router.post("/", verifyFirebaseToken, postNotification);



module.exports = router;