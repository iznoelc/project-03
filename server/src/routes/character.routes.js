/**
 * character.routes.js
 * 
 * Routes fulfilled by user controller
 * 
 * @author Landon Chapin
 */

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createCharacter, getAllCharacters, deleteCharacter, getCharacterByID } = require("../controllers/character.controller");

// create character
router.post("/", verifyFirebaseToken, createCharacter);

// get a character of the matching _id
router.get("/:id", verifyFirebaseToken, getCharacterByID);

// get all character
router.get("/", verifyFirebaseToken, getAllCharacters);

// delete character by MongoDB _id
router.delete("/:id", verifyFirebaseToken, deleteCharacter);




module.exports = router;

