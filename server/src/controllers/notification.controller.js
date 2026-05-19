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
        const { uid } = req.user;

        const notifications = await Notification.find({receiver: uid})
        .sort({createdAt: -1})
        .limit(50) // only show 20 newest

        res.json(notifications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "[SERVER ERROR WHEN ATTEMPTING TO FETCH ALL NOTIFICATIONS FOR A SPECIFIC USER]" });
    }
}

async function markAsRead(req, res){
    try {
        const currentNotification = await Notification.findOne({_id: req.params.id});

        if (!currentNotification) { return res.status(404).json({ error: "Invalid notification." })} // no notification, return

        if (req.body.read !== undefined){
            currentNotification.read = req.body.read;
        }

        const patched = await Notification.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { read: currentNotification.read } },
            { returnDocument: "after" }
        );

        // trigger pusher to update notifications when one is marked as read
        await pusher.trigger(`user-${patched.receiver}`, 'notification-read', {
            _id: patched._id,
            read: patched.read,
        });

        return res.status(200).json({ notification: patched });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function deleteNotification(req, res){
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);
    try {
        const notif = await Notification.findOne({_id: req.params.id});

        if (!notif){
            return res.status(404).json({error: "Trying to delete a notiication that was not found."});
        }

        const deleted = await Notification.findOneAndDelete({ _id: req.params.id });

        if (!deleted) {
            return res.status(404).json({ error: "Error deleting notification from the database." });
        }

        await pusher.trigger(`user-${deleted.receiver}`, 'notification-deleted', {
            _id: deleted._id,
        });

        res.status(200).json({ message: "Notification deleted successfully from the database!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { postNotification, getNotificationsForAUser, markAsRead, deleteNotification };