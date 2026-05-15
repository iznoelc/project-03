import useAuth from "../hooks/useAuth";

import { postNotification, getAllNotifications } from "../utils/Notifications";

export default function TempNotificationsTest(){
    const { user, dbUser } = useAuth();
    
    const logNotifications = async (uid) => {
        const token = await user.getIdToken();
        const notifications = await getAllNotifications(uid, token);
        if (notifications) console.log(notifications);
    }

    const notifTest = async (sender, receiver, type, body) => {
        console.log("Posting notif");
        const token = await user.getIdToken();

        await postNotification(sender, receiver, type, body, token);
    }

    return (<>
        <h1>This is to test notifications. Displaying notifications for {dbUser.displayName} with UID {user.uid}</h1>
        <button className="btn btn-primary" onClick={() => notifTest(user.uid, "eZd3HcfbBdMq7LvNFEPWWY3ceoD3", "Evil", "YOU ARE EVIL PRIMUS")}>Send a notification to EVIL PRIMUS!</button>
        <button className="btn btn-neutral" onClick={() => logNotifications(user.uid)}></button>
    </>)
}