/**
 * user.model.js
 * 
 * Defines the schema for the user in the database.
 * 
 * @author Izzy Carlson
 */

const mongoose = require("mongoose");
require("./character.model");

const userSchema = new mongoose.Schema({
    // REQUIRED FIELDS
    uid: {
        type: String, required: true, unique: true
    },
    displayName: {
        type: String, required: true
    },
    role: {
        type: String, enum: ["creator", "admin"], default: "creator", required: true
    },
    bio: {
        type: String, default: "No bio yet.", required: false
    },
    favChars: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}], required: false, default: []
    },
    accountStatus: {
        type: String, enum: ["active", "disabled"], default: "active", required: true
    },
    pfp: {
        type: String, default: "",
    },
    username: { // unique username all lower case
        type: String, required: true, unique: true, trim: true, lowercase: true, sparse: true
    },
}, { 
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);