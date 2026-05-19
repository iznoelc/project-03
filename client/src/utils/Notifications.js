/**
 * Utility file that holds methods regarding notification CRUD operations.
 * 
 * @author: Izzy Carlson
 */

export const postNotification = async (sender, receiver, type, body, token) => {
    console.log("[POSTING NOTIFICATION]");
        try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                sender: sender,
                receiver: receiver,
                type: type,
                notifBody: body,
            }),
        });

        if (!res.ok){
            throw new Error(`[ERROR CREATING NOTIFICATION IN DATABASE] Status: ${res.status}`);
        }
        console.log("NOTIFICATION POSTED SUCCESSFULLY");

    } catch (error){
        console.error("[ERROR CREATING NOTIFICATION IN DATABASE]: ", error);
    }
}

export const markAsRead = async (_id, token) => {
    console.log("[MARKING NOTIFICATION AS READ]");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/mark-as-read/${_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                read: true,
            }),
        });

        if (!res.ok){
            throw new Error(`[ERROR MARKING NOTIFICATION AS READ ${_id}] Status: ${res.status}`);
        }

        console.log("NOTIFICATION'S MARKED READ SUCCESSFULLY");
    } catch (error){
        console.error("[NOTIFICATION GET ERROR]: ", error);
    }
}

// get all notifications for a user
export const getAllNotifications = async (uid, token) => {
    console.log("[GETTING ALL NOTIFICATIONS]");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${uid}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok){
            throw new Error(`[ERROR GETTING NOTIFICATIONS FOR USER WITH UID ${uid}] Status: ${res.status}`);
        }
        console.log("NOTIFICATION'S RETRIEVED SUCCESSFULLY");

        const data = await res.json();
        return data;
    } catch (error){
        console.error("[NOTIFICATION GET ERROR]: ", error);
    }
}

export const deleteNotification = async (_id, token) => {
    console.log("[DELETING NOTIFICATION]");
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok){
            throw new Error(`[ERROR DELETING NOTIFICATION FROM DATABASE] Status: ${res.status}`);
        }

        console.log("NOTIFICATION DELETED SUCCESSFULLY");

    } catch (error){
        console.error("[ERROR]: ", error);
    }
}