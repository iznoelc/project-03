/**
 * user.controller.js
 * 
 * Defines API endpoints behavior relating to users.
 * 
 * @author Izzy Carlson
 */
const User = require("../models/user.model");
const userValidator = require("../validators/user.validator");
const admin = require("firebase-admin");

// POST a new user to the database
async function createUser(req, res) {
    try {
        const { error, value } = userValidator.validateUser(req.body);

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

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// PATCH to edit a user based on the params sent in the request
async function updateUser(req, res){
    try {
        console.log("[REQ USER FOR USER PATCH REQUEST]: ", req.user);
        console.log("[REQ BODY FOR USER PATCH REQUEST]: ", req.body);

        // find the current user from the patch request
        const currentUser = await User.findOne({uid: req.user.uid});
        console.log("[CURRENT USER ROLE FROM USER PATCH REQUEST]: ", currentUser.role);
        
        // find the user from the patch request params (the user that should be updated)
        const user = await User.findOne({uid: req.params.uid});

        const updateFields = {};

        // fields that any user can update (i.e. editing profile or favoriting characters)
        const allowedFields = ["displayName", "favChars", "pfp", "bio", ];

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updateFields[key] = req.body[key];
            }
        }

        if (req.body.approved !== undefined) {
            if (!currentUser || currentUser.role !== "admin") {
                return res.status(403).json({ error: "Only admins can approve users." });
            }
            updateFields.approved = req.body.approved;
        }


        // if the user makes a request to edit the accountStatus field, we need to make sure they're an admin
        if (req.body.accountStatus !== undefined){
            if (!currentUser) { return res.status(401).json({ error: "Invalid user." })} // no user, return
            if (currentUser.role !== "admin") // 
                { return res.status(403).json({ error: "Access denied. The user trying to make this change is not an admin."})}
            updateFields.accountStatus = req.body.accountStatus;
        }

        const patched = await User.findOneAndUpdate(
            { uid: req.params.uid },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        return res.status(200).json({ user: patched });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


module.exports = { createUser, getUserByUID, getAllUsers, updateUser };