/**
 * notification.model.js
 * 
 * Defines the schema for the notifications in the database.
 * 
 * @author Izzy Carlson
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    // REQUIRED FIELDS
    sender: {
        type: String, required: true,
    },
    receiver: {
        type: String, required: true,
    },
    read: {
        type: Boolean, required: true, default: false,
    },
    type: {
        type: String, required: true, default: "Type unspecified."
    },
    notifBody: {
        type: String, required: true, default: "No body."
    },
}, { 
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);