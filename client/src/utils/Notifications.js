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

export function markAsRead(){
    console.log("[MARKING NOTIFICATION AS READ]");
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

export function getAllUnreadNotifications(){
    console.log("[GETTING ALL UNREAD NOTIFICATIONS]");
}

export function deleteNotification(){
    console.log("[DELETING NOTIFICATION]");
}