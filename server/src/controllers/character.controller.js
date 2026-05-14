/**
 * character.controller.js
 *
 * Defines API endpoints behavior relating to characters.
 *
 * @author Landon Chapin
 */

const Character = require("../models/character.model");

const { validateNewCharacter } = require("../validators/character.validator");

async function updateCharacter(req, res) {
    try {
        const updated = await Character.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Character not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// POST: Create a new Character
async function createCharacter(req, res) {
    const { error } = validateNewCharacter(req.body);

    // throw an error if new character isn't valid, otherwise continue
    if (error) {
        return res.status(400).send(error.message);
    }

    try {
        const {
            owner_uid,
            name,
            bio,
            creator,
            iconImg,
            vis,
            exportable,
            link,
            referenceImg,
            tags
        } = req.body;

        // Required field validation
        if (!owner_uid) return res.status(400).json({ error: "Owner UID is required" });
        if (!name) return res.status(400).json({ error: "Character name is required" });
        if (!creator) return res.status(400).json({ error: "Creator is required" });

        const character = new Character({
            owner_uid,
            name,
            bio,
            creator,
            iconImg,
            vis,
            exportable,
            link,
            referenceImg,
            tags
        });

        await character.save();

        res.status(201).json({
            message: "Character created successfully",
            character
        });

    } catch (err) {
        console.error("Create error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// GET: Retrieve all Characters
async function getAllCharacters(req, res) {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// DELETE: Remove a Character by ID
async function deleteCharacter(req, res) {
    try {
        const deleted = await Character.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Character not found" });
        }

        res.json({ message: "Character deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getCharacterByID(req, res) {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ error: "Character not found" });
        }

        res.status(200).json(character);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {updateCharacter, createCharacter,getAllCharacters,deleteCharacter, getCharacterByID};
