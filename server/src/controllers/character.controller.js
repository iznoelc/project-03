/**
 * character.controller.js
 *
 * Defines API endpoints behavior relating to characters.
 *
 * @author Landon Chapin
 */

const Character = require("../models/character.model");

// POST: Create a new Character
async function createCharacter(req, res) {
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
        const deleted = await Character.findByIdAndDelete(req.params._id);

        if (!deleted) {
            return res.status(404).json({ message: "Character not found" });
        }

        res.json({ message: "Character deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {createCharacter,getAllCharacters,deleteCharacter};
