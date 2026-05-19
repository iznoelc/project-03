/**
 * useNotifications.jsx
 * 
 * Allows for notifications to be used in other files.
 * 
 * @author Izzy Carlson
 */

import { useState, useEffect } from "react";
import { getAllNotifications } from "../utils/Notifications";
import Pusher from "pusher-js"

export default function useNotifications(user){
    const [notifications, setNotifications] = useState([]);
    const [notifsLoading, setNotifsLoading] = useState(false);

    // == INITIAL FETCH ==
    useEffect(() => {
        
        const fetchNotifications = async () => {
            const token = await user.getIdToken();
            setNotifsLoading(true);
            const data = await getAllNotifications(user.uid, token);
            if (data)
                setNotifications(data);
            console.log(data);
            setNotifsLoading(false);
        }

        fetchNotifications();
        
    }, [user]);

    // == LIVE UPDATES ==
    // use Pusher to receive real-time notification updates
    useEffect(() => {
        // connect front end to pusher's server's using the public project key.
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        // joins the channel named after the current user, so that when the backend triggers a notification update,
        // the frontend client (this user) receieves the trigger
        const channel = pusher.subscribe(`user-${user.uid}`);

        // listens for an event with the new-notification label. so, when the trigger fires, the new notification is received by
        // the front end, and updates the notifications so the new notification appears without requiring a refetch.
        channel.bind("new-notification", (data) => {
            setNotifications((prev) => [data, ...prev]);
        });

        // listens for event with the notification-read label. when the trigger fires, the notifications are updated to mark which ever ones
        // were marked as read to read.
        channel.bind("notification-read", (data) => {
            setNotifications((prev) => prev.map(n => n._id === data._id ? { ...n, read: data.read } : n));
        });

        // listens for event with notification-deleted label. when the trigger fires, the notifications are updated to remove the deleted one.
        channel.bind("notification-deleted", (data) => {
            setNotifications((prev) => prev.filter(n => n._id !== data._id));
        });

        // cleanup
        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`user-${user.uid}`);
        };
    }, [user.uid])

    return { notifications, notifsLoading };

}