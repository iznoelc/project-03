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
const pusher = require("../config/pusher");

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

        // use Pusher to send a message to Pusher's servers so that any clients subscribed receieve the trigger
        await pusher.trigger(`user-${notif.receiver}`, 'new-notification', notif.toObject());

        res.status(201).json({ message: "[NOTIFICATION CREATED SUCCESSFULLY]", notif });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "[SERVER ERROR WHEN TRYING TO POST A NOTIFICATION]" });
    } 
};

// get all of the notifications for the current user
async function getNotificationsForAUser(req, res) {
    try {
        const { uid } = req.user.uid;

        const notifications = await Notification.find({uid})
        .sort({createdAt: -1})
        .limit(50) // only show 20 newest

        res.json(notifications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "[SERVER ERROR WHEN ATTEMPTING TO FETCH ALL NOTIFICATIONS FOR A SPECIFIC USER]" });
    }
}

module.exports = { postNotification, getNotificationsForAUser };