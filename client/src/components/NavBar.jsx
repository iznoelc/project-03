import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBell, FaSearch } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";

import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function NavBar(){
    const navigate = useNavigate();
    const { loggedIn, signOutUser, user } = useAuth();

    // nav bar if the user is not logged in
    if (!loggedIn) return (
        <div className="navbar bg-base-100 shadow-sm">
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
        <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
            <a className="btn btn-ghost text-xl" onClick={() => navigate("/", { replace: true })}><GiFallingStar />constellation</a>
        </div>
        <div className="navbar-center">
            <ul className="menu sm:menu-vertical lg:menu-horizontal px-1">
                <button className="btn btn-ghost" onClick={() => navigate("/explore")}><FaSearch /></button>
            </ul>
        </div>
        <div className="navbar-end">
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                <FaBell className="text-xl"/>
                <span className="badge badge-sm indicator-item">8</span>
                </div>
            </div>
            <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                <div className="card-body">
                <span className="text-lg font-bold">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                    <button className="btn btn-primary btn-block">View cart</button>
                </div>
                </div>
            </div>
            </div>
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <IoPersonCircleOutline className="text-4xl" />
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><a className="justify-between" onClick={() => navigate(`/profile/${user.uid}`, { replace : true })}>
                    Profile
                </a></li>
                <li><a>Dashboard</a></li>
                <li><a className="btn" onClick={signOutUser}>Logout</a></li>
            </ul>
            </div>
        </div>
        </div>
    )
}