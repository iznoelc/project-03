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
const { updateCharacter, createCharacter, getAllCharacters, deleteCharacter, getCharacterByID, getLatestCharacters } = require("../controllers/character.controller");

// get the 10 latest characters
router.get("/get-latest", getLatestCharacters);

//used for the editing portion of teh details page
router.patch("/:id", verifyFirebaseToken, updateCharacter);

// create character
router.post("/", verifyFirebaseToken, createCharacter);

// get a character of the matching _id
router.get("/:id", verifyFirebaseToken, getCharacterByID);

// get all character
router.get("/", verifyFirebaseToken, getAllCharacters);

// delete character by MongoDB _id
router.delete("/:id", verifyFirebaseToken, deleteCharacter);


module.exports = router;

