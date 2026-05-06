import IconPlaceholder from "../../assets/IconPlaceholder.png";
import { FaPen, FaInfoCircle } from "react-icons/fa";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import FallbackElement from "../FallbackElement";

export default function UserProfile(){
    const { uid } = useParams();
    const { user, dbUser, fetchUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [editLoading, setEditLoading] = useState(false);

    const isOwnProfile = user?.uid === uid;

    const [formData, setFormData] = useState({
        displayName: dbUser.displayName,
        bio: dbUser.bio,
    });

    useEffect(() => {
        if (!user || !uid) return;

        async function fetchUser(){
            setLoading(true);

            try {
                const userRes = await fetch (`${import.meta.env.VITE_API_URL}/users/${uid}`, {
                    headers: {
                        Authorization: `Bearer ${await user.getIdToken()}`,
                    },
                });

                if (!userRes.ok) { throw new Error(`[ERROR FETCHING USER PROFILE] Status: ${userRes.status}`)}

                const userData = await userRes.json();
                console.log("[USER PROFILE DATA]: ", userData);
                setProfile(userData);
                
            } catch (error) {
                console.error("[ERROR FETCHING USER PROFILE]: ", error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();

    }, [uid, user]);

    // update text fields accordingly when user types
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    function handleCancel(){
        setFormData({
            displayName: dbUser.displayName,
            bio: dbUser.bio,
        })
        setIsEditing(false);
    }

    const handleEditProfileInDatabase = async () => {
        console.log("[SUBMITTING FORM]: ", formData);

        setEditLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                displayName: formData.displayName,
                bio: formData.bio,
            }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const updatedProfileInformation = await res.json();

            setProfile({ user: updatedProfileInformation.user }); // uodate profile immediately with new information
            await fetchUser(user.uid, token)

            alert("Profile edited successfully!")
        } catch (error) {
            console.log("[FAILED TO UPDATE PROFILE]: ", error.message);
            handleCancel();
            alert("Error editing your profile.");
        } finally {
            setEditLoading(false);
            setIsEditing(false);
        }
    }

    

    if (loading || editLoading) return <FallbackElement />;
    if (!profile) return <><h1>No profile found.</h1></>;
    
    return (
        <>
        <div className="flex flex-col items-center justify-center pt-24">
            <div className="flex flex-col bg-base-200 rounded-lg items-center p-16 gap-2 shadow-2xl w-full max-w-4xl">
                <img src={profile.user?.pfp === "" ? IconPlaceholder : profile.user?.pfp} className="w-50 h-50" />
                {isEditing ? <>
                    <h2><i>You are currently editing your profile.</i></h2>

                    <form className="flex flex-col items-center w-full" onSubmit={handleEditProfileInDatabase}>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-center w-full" style={{ gridTemplateColumns: '140px 1fr' }}>
                            <p className="text-lg text-left"><b>Display Name</b></p>
                            <label className="input w-full">
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    value={formData.displayName}
                                    required
                                    placeholder={profile.user?.displayName}
                                    onChange={handleChange}
                                />
                            </label>

                            <p className="text-lg text-left"><b>Bio</b></p>
                            <textarea
                                id="bio"
                                name="bio"
                                className="w-full border border-base-content/20 rounded-md p-2 focus:outline-white"
                                value={formData.bio}
                                placeholder="Your bio can be up to 200 characters or you can have no bio at all! Mysterious."
                                onChange={handleChange}
                            />
                        </div>    
                        <div className="flex p-4 gap-4 w-full justify-center">
                                <button type="submit" className="btn btn-neutral">Save Changes</button>
                                <p onClick={() => handleCancel()}>Cancel</p>
                        </div>  
                </form>
                    
                </> : <>
                    <div className="flex items-center gap-4 justify-center w-full">
                        
                        <h1 className="text-3xl">
                            {profile.user?.displayName} {profile.user?.role === "admin" && <div class="badge badge-primary">Admin</div>}
                        </h1>
                        {isOwnProfile && <FaPen onClick={() => setIsEditing(true)} />}
                    </div>
                    <h2 className="text-xl">Joined on {new Date(profile.user?.createdAt).toLocaleDateString('en-US')}</h2>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-center w-full">
                        {/* show email address only for own profile */}
                        {
                            isOwnProfile &&
                            <>
                                    <p className="text-right"><b>Email Address</b></p>
                                    
                                <p className="w-full text-left">{user.email}</p>
                            </>
                        }
                    </div>
                    <div className="flex flex-col pt-6 items-center">
                        <p className="text-lg text-left"><b>Bio</b></p>
                        <p className="w-full text-center">{profile.user?.bio}</p>
                    </div>
                </>}
            </div>
        </div>
        </>
    )
}