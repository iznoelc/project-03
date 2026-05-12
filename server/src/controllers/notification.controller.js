/**
 * notification.controller.js
 * 
 * Defines API endpoints behavior relating to users.
 * 
 * @author Izzy Carlson
 */
const Notification = require("../models/notification.model");
// const { validateUser, validateEditedProfile } = require("../validators/user.validator");
const admin = require("firebase-admin");

// POST a new notification to the database
async function postNotification(req, res) {
    try {
        // const { error, value } = validateUser(req.body);

        // // make sure fields are properly validated before creating the user
        // if (error) {
        //     return res.status(400).send(error.message);
        // }

        // create a new notification with the provided fields
        const notif = new Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            read: req.body.read,
            type: req.body.type,
            notifBody: req.body.notifBody,
        });
        await notif.save();

        res.status(201).json({ message: "[NOTIFICATION CREATED SUCCESSFULLY]", notif });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "[SERVER ERROR WHEN TRYING TO POST A NOTIFICATION]" });
    } 
};

module.exports = { postNotification };