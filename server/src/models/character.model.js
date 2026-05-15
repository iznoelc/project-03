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
        type: String, required: true,
    },
    vis: {
        type: String, enum: ["public", "private"], default: "private", required: true
    }, 
    exportable: {
        type: Boolean, default: true, required: true,
    },
    link: {
        type: String, default: ""
    },
    referenceImg: {
        type: String, default: ""
    },
    tags: {
        type: [String], default: []
    },
    userIsCreator: {
        type: Boolean, default: false, required: true
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("Character", characterSchema);