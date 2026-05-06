/**
 * character.model.js
 * 
 * Defines the schema for the characters in the database.
 * 
 * @author Izzy Carlson
 */

const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    // REQUIRED FIELDS
    owner_uid: {
        type: String, required: true,
    },
    name: {
        type: String, required: true
    },
    bio: {
        type: String, required: false
    },
    creator: {
        type: String, required: true,
    },
    iconImg: {
        type: String,
    },
    vis: {
        type: String, enum: ["public", "private"], default: "private", required: true
    }, 
    exportable: {
        type: Boolean, default: true, required: true,
    },
    link: {
        type: String,
    },
    referenceImg: {
        type: String,
    },
    tags: {
        type: [String], default: []
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("Character", characterSchema);