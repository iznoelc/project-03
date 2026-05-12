import useAuth from "../hooks/useAuth";

import { postNotification } from "../utils/Notifications";

export default function TempNotificationsTest(){
    const { user, dbUser } = useAuth();

    const notifTest = async (sender, receiver, type, body) => {
        console.log("Posting notif");
        const token = await user.getIdToken();

        await postNotification(sender, receiver, type, body, token);
    }

    return (<>
        <h1>This is to test notifications. Displaying notifications for {dbUser.displayName} with UID {user.uid}</h1>
        <button className="btn btn-primary" onClick={() => notifTest(user.uid, "eZd3HcfbBdMq7LvNFEPWWY3ceoD3", "Evil", "YOU ARE EVIL PRIMUS")}>Send a notification to EVIL PRIMUS!</button>
    </>)
}