/**
 * user.controller.js
 * 
 * Defines API endpoints behavior relating to users.
 * 
 * @author Izzy Carlson
 */
const User = require("../models/user.model");
const validator = require("../validators/user.validator");
const admin = require("firebase-admin");

// POST a new user to the database
async function createUser(req, res) {
    try {
        const { error, value } = validator.validateUser(req.body);

        // make sure fields are properly validated before creating the user
        if (error) {
            return res.status(400).send(error.message);
        }

        const existingUser = await User.findOne({uid: value.uid});

        if (existingUser){
            return res.status(200).json({
                message: "[USER ALREADY EXISTS IN DATABASE]: ",
                user: existingUser
            });
        }

        // create a new user with the provided fields and then save it to the database
        // then, return a success response with the created user
        const user = new User({
            uid: value.uid,
            displayName: value.displayName,
            role: value.role,
            accountStatus: value.accountStatus,
        });
        await user.save();

        res.status(201).json({ message: "USER CREATED SUCCESSFULLY", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "[SERVER ERROR WHEN TRYING TO POST A USER]" });
    } 
};

// GET a single user by their uid
async function getUserByUID(req, res) {
    try {
        const user = await User.findOne({ uid: req.params.uid }) // try to find the user by the request param
        .populate({
            path: "favChars",
            match: {}
        });
         

        // if the user couldnt be found, send a bad request response with an error msg
        if (!user) {
            return res.status(404).json({ error: "[USER NOT FOUND]" });
        }

        res.status(200).json({ user }); // if the user was found, send a success response with the user
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "[SERVER ERROR WHEN TRYING TO GET USER BY THEIR UID]" });
    }
};


module.exports = { createUser, getUserByUID, };