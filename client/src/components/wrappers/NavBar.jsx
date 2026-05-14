import Notifications from "./Notifications";

import { IoPersonCircleOutline } from "react-icons/io5";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";

import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function NavBar(){
    const navigate = useNavigate();
    const { loggedIn, signOutUser, user, dbUser, role, extraDataLoading } = useAuth();

    // nav bar if the user is not logged in
    if (!loggedIn || extraDataLoading) return (
        <div className="navbar bg-base-200 shadow-sm">
        <div className="navbar-start">
            <a className="btn btn-ghost text-xl" onClick={() => navigate("/", { replace: true })}><GiFallingStar />constellation</a>
        </div>
        <div className="navbar-center">
            <ul className="menu px-1">
                <button className="btn btn-ghost" onClick={() => navigate("/explore")}><FaSearch /></button>
            </ul>
        </div>
        <div className="navbar-end">
            <div className="dropdown dropdown-end">
                <div className="flex gap-2">
                    <button className="btn btn-primary btn-outline" onClick={() => navigate("/login")}>Login</button>
                    <button className="btn btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
                </div>
            </div>
        </div>
        </div>
    )

    // nav bar if the user is logged in
    if (loggedIn) return (
        <div className="navbar bg-base-200 shadow-sm">
        <div className="navbar-start">
            <a className="btn btn-ghost text-xl" onClick={() => navigate("/", { replace: true })}><GiFallingStar />constellation</a>
        </div>
        <div className="navbar-center">
            <ul className="menu sm:menu-vertical lg:menu-horizontal px-1">
                <button className="btn btn-ghost" onClick={() => navigate("/explore")}><FaSearch /></button>
            </ul>
            {role === "creator" &&
            <button className="btn btn-primary" onClick={() => navigate("/characters/create")}>
                {window.innerWidth > 640 ? <div className="flex flex-row gap-2 items-center"><FaPlus /><p>New Character</p></div> : <FaPlus />}
            </button>
            }
        </div>
        <div className="navbar-end">
            <Notifications />
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                {dbUser !== null && dbUser?.user?.pfp !== "" ? <img src={dbUser?.user?.pfp} className="w-10 h-10" /> : <IoPersonCircleOutline className="text-4xl" />}
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><a className="justify-between" onClick={() => navigate(`/profile/${user.uid}`, { replace : true })}>
                    Profile
                </a></li>
                <li><a onClick={() => navigate(
                        role === "admin" ? "/admin-dashboard" :
                        role === "creator" ? "creator-dashboard" :
                        "/",
                        { replace: true }
                        )}>
                    Dashboard
                </a></li>
                <li><a className="btn" onClick={signOutUser}>Logout</a></li>
            </ul>
            </div>
        </div>
        </div>
    )
}