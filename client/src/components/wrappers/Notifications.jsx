import { FaBell } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";

export default function Notifications(){
    const { user } = useAuth();
    const { notifications } = useNotifications(user);

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle pr-1">
            <div className="indicator">
            <FaBell className="text-xl"/>
            <span className="badge badge-xs indicator-item">8</span>
            </div>
        </div>
        <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
            <div className="card-body">
            {notifications.map((notif) => (
                <p key={notif._id}>
                    {notif.notifBody}
                </p>
            ))}
            <span className="text-lg font-bold">8 Items</span>
            <span className="text-info">Subtotal: $999</span>
            <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
            </div>
            </div>
        </div>
        </div>  
    );
}