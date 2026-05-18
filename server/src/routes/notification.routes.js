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
const { postNotification, getNotificationsForAUser, markAsRead } = require("../controllers/notification.controller");

// mark a notification as read
router.patch("/mark-as-read/:id", verifyFirebaseToken, markAsRead);

// post a new notification to the database
router.post("/", verifyFirebaseToken, postNotification);

// get a notification by the user's uid
router.get("/:uid", verifyFirebaseToken, getNotificationsForAUser);

module.exports = router;