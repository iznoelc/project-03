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
        console.error("[ERROR CREATING USER IN THE DATABASE, DELETING THEM FROM FIREBASE]: ", error);
    }
}

export function markAsRead(){
    console.log("[MARKING NOTIFICATION AS READ]");
}

export function getAllNotifications(){
    console.log("[GETTING ALL NOTIFICATIONS]");
}

export function getAllUnreadNotifications(){
    console.log("[GETTING ALL UNREAD NOTIFICATIONS]");
}

export function deleteNotification(){
    console.log("[DELETING NOTIFICATION]");
}