import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { postNotification } from "../../utils/Notifications";

/**
 * AdminDashboard.jsx
 * 
 * Dashboard for all admin users, contains website stats, users to disable, enable, and delete.
 * 
 * @author Esperanza Paulino
 */

export default function AdminDashboard() {
    const { user } = useAuth();

    const [usersList, setUsersList] = useState([]);

    const [userQuery, setUserQuery] = useState("");
    const [actionQuery, setActionQuery] = useState("");

    useEffect(() => {
        if (!user) return;

        fetchUsers((data) => {
            const filtered = data.filter(u => u.uid !== user.uid);
            setUsersList(filtered);
        }, user);

    }, [user]);


    // LEFT — Active users
    const activeList = usersList.filter(
        u => u.accountStatus === "active"
    );
    const activeUsers = Search(activeList, userQuery);

    // RIGHT — Disabled users (your original logic)
    const disabledList = usersList.filter(
        u => u.accountStatus === "disabled"
    );
    const disabledUsers = Search(disabledList, actionQuery);


    // Stats (backend uses "creator" not "user")
    const adminCount = usersList.filter(u => u.role === "admin").length+1;
    const userCount = usersList.filter(u => u.role === "creator").length;

    const [randomNum] = useState(() => Math.floor(Math.random() * 1000));

    return (
        <div>
            <div className="hero bg-base-200 gap-2">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl">ADMIN DASHBOARD</h1>
                        <p>
                            Dear {user?.displayName || "admin"}, welcome to the admin dashboard.
                            Here you can view site statistics, search users, delete users,
                            and approve new admins.
                        </p>

                        <h1 className="text-3xl font-bold pt-8">Site Statistics</h1>

                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <StatCard number={adminCount} label="Admins" />
                            <StatCard number={userCount} label="Creators" />
                            <StatCard number={usersList.length} label="Total Accounts" />
                            <StatCard number={randomNum} label="Site Traffic (views/hr)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full p-6">

                {/* LEFT — ALL USERS */}
                <div className="flex flex-col items-start bg-base-200 p-4 rounded h-full">
                    <h3 className="text-4xl font-bold">All Users</h3>

                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full max-w-xs my-4"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                    />

                    {activeUsers.map((u) => ( 
                        <div
                            key={u.uid}
                            className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                        >
                            <h3>{u.displayName}</h3>
                            <p className="text-sm mt-2">{u.role}</p>

                            <button
                                className="btn btn-warning btn-sm mt-4"
                                onClick={() => Disable(user, u.uid, setUsersList)}
                            >
                                Disable
                            </button>
                            <button
                                className="btn btn-error btn-sm mt-4"
                                onClick={() => Delete(user, u.uid, setUsersList)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* RIGHT — RE-ENABLE */}
                <div className="flex flex-col items-start bg-base-200 p-4 rounded h-full">
                    <h3 className="text-4xl font-bold"> Disabled Users</h3>

                    <input
                        type="text"
                        placeholder="Search admins"
                        className="input input-bordered w-full max-w-xs my-4"
                        value={actionQuery}
                        onChange={(e) => setActionQuery(e.target.value)}
                    />

                    {disabledUsers.map((u) => ( 
                        <div
                            key={u.uid}
                            className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                        >
                            <h3>{u.displayName}</h3>
                            <p className="text-sm mt-2">{u.role}</p>

                            <button
                                className="btn btn-success btn-sm mt-4"
                                onClick={() => Enable(user, u.uid, setUsersList)}
                            >
                                Re-Enable
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            <ToastContainer />
        </div>
    );
}

function StatCard({ number, label }) {
    return (
        <div className="flex flex-col items-center bg-base-200 p-4 rounded">
            <span className="text-4xl font-bold">{number}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
}

async function fetchUsers(setUsersList, user) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
            },
        });

        const data = await res.json();
        setUsersList(data);
    } catch (err) {
        console.error("Failed to fetch users:", err);
    }
}

async function Enable(user, userId, setUsersList) {
    try {
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ accountStatus: "active" }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        await postNotification(user.uid, userId, "ENABLED", "Your account has been re-enabled!", token);

        setUsersList(prev =>
            prev.map(u =>
                u.uid === userId ? { ...u, accountStatus: "active" } : u
            )
        );

        toast.success("User re-enabled successfully!");
    } catch (err) {
        console.log("Failed to approve admin:", err);
        toast.error("Failed to approve admin.");
    }
}

async function Delete(user, userId, setUsersList) {
    const confirmed = await confirmToast("Delete this user?");
    if (!confirmed) return;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
            },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        setUsersList(prev => prev.filter(u => u.uid !== userId));
        toast.success("User deleted successfully!");
    } catch (err) {
        console.log("Error deleting user", err);
    }
}

async function Disable(currentUser, userId, setUsersList) {
    try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ accountStatus: "disabled" }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        await postNotification(currentUser.uid, userId, "DISABLED", "Your account has been disabled", token);

        setUsersList(prev =>
            prev.map(u =>
                u.uid === userId ? { ...u, accountStatus: "disabled" } : u
            )
        );

        toast.success("User disabled successfully!");
    } catch (err) {
        console.log("Failed to disable user:", err);
        toast.error("Failed to disable user.");
    }
}


function confirmToast(message = "Are you sure?") {
    return new Promise((resolve) => {
        toast(
            ({ closeToast }) => (
                <div>
                    <p className="font-bold mb-2">{message}</p>

                    <div className="flex gap-2">
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => {
                                resolve(true);
                                closeToast();
                            }}
                        >
                            Yes
                        </button>

                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                resolve(false);
                                closeToast();
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                hideProgressBar: true,
            }
        );
    });
}

function Search(list, query) {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(item =>
        Object.values(item).some(v =>
            String(v).toLowerCase().includes(q)
        )
    );
}
