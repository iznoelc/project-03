import { useState } from "react";
import { FaBell } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
import { markAsRead, deleteNotification } from "../../utils/Notifications";

export default function Notifications(){
    const { user } = useAuth();
    const { notifications } = useNotifications(user);

    const [open, setOpen] = useState(false); // state of the notification drop down

    const read = async (_id) => {
        const token = await user.getIdToken();
        await markAsRead(_id, token);
    }

    const deleteNotif = async (_id) => {
        const token = await user.getIdToken();
        await deleteNotification(_id, token);
    }

    return (
        <div className="dropdown dropdown-end drop-shadow-2xl z-50">
            <button className="btn btn-ghost btn-circle pr-1" onClick={() => setOpen(!open)}>
            <div className="indicator">
            <FaBell className="text-xl"/>
            {notifications.length !== 0 && <span className="badge badge-xs badge-primary indicator-item">{notifications.length}</span>}
            </div>
        </button>


        {/* invisible overlay to close on outside click */}
        {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>}

        {open &&
            <div
                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-96 max-h-96 overflow-y-auto shadow">
                <div className="card-body">
                {notifications.length === 0 && <p className="text-lg text-opacity-50">No notifications yet!</p>}
                {notifications.map((notif) => (
                    <div className="card w-full bg-base-200 card-xs shadow-sm" key={notif._id}>
                        <div className="card-body">
                            <h2 className="card-title">{notif.type}</h2>
                            <p>{notif.notifBody}</p>
                            <div className="justify-end card-actions">
                            {!notif.read && <button className="btn btn-primary" onClick={() => read(notif._id)}>Mark as Read</button>}
                            <button className="btn btn-error" onClick={() => deleteNotif(notif._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        }
        </div>  
    );
}