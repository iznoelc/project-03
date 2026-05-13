import IconPlaceholder from "../../assets/IconPlaceholder.png";
import { FaPen } from "react-icons/fa";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useUsernameCheck from "../../hooks/useUsernameCheck"
import uploadToImgBB from "../../imgbb/imgbb";

import ProfileLoadingSkeleton from "./ProfileLoadingSkeleton";

import { successNotify, errorNotify } from "../../utils/ToastifyNotifications";

export default function UserProfile(){
    const MAX_FILE_SIZE = 1024 * 1024 * 2; // max 2MB
    
    const { uid } = useParams();
    const { user, dbUser, fetchUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [pfpFile, setPfpFile] = useState(null);
    const [previewPfp, setPreviewPfp] = useState(dbUser.pfp);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPfp, setIsEditingPfp] = useState(false);

    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [pfpLoading, setPfpLoading] = useState(false);

    const isOwnProfile = user?.uid === uid;
    

    const [formData, setFormData] = useState({
        displayName: dbUser.displayName,
        bio: dbUser.bio,
        username: dbUser.username,
        pfp: dbUser.pfp,
    });

    const { usernameAvail, usernameChecking } = useUsernameCheck(formData.username);

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

    function handleCancel(type){
        switch (type){
            case "pfp":
                setPreviewPfp(dbUser.pfp);
                setIsEditingPfp(false);
                return;
            case "info":
                setFormData({
                    displayName: dbUser.displayName,
                    bio: dbUser.bio,
                    username: dbUser.username,
                });
                setIsEditing(false);
                return;
        }
    }

    const handleEditProfileInDatabase = async (event) => {
        event.preventDefault();
        if (usernameChecking) return; // have not yet determined if username is available
        if (usernameAvail === false && formData.username !== profile.user?.username) return; // return if username is not available
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
                username: formData.username,
            }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const updatedProfileInformation = await res.json();

            setProfile({ user: updatedProfileInformation.user }); // uodate profile immediately with new information
            await fetchUser(user.uid, token)

            successNotify("Profile edited successfully!");
        } catch (error) {
            console.log("[FAILED TO UPDATE PROFILE]: ", error.message);
            handleCancel();
            errorNotify("There was an error when saving your profile edits, please try again.");
        } finally {
            setEditLoading(false);
            setIsEditing(false);
        }
    }

    // show the user a preview of the file they uploaded
    const handleFileSelected = async (event) => {
        event.preventDefault();
        let pfpFile = event.target.files[0];

        // file is too big
        if (pfpFile && pfpFile.size > MAX_FILE_SIZE){
            errorNotify("That file is too large. Please use a different file!");
            event.target.value = ""; // clear file upload
        } else { // file is fine, continue with preview
            setPreviewPfp(URL.createObjectURL(pfpFile));
            setPfpFile(pfpFile);
        }        
    }

    // handle uploading the new pfp file to the database when the user actually saves their changes
    const handleFileUploaded = async (event) => {
        event.preventDefault();
        
        if (!pfpFile) return;

        console.log("Uploading ", pfpFile);
        setPfpLoading(true);
        try {
            const url = await uploadToImgBB(pfpFile);

            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                pfp: url,
            }),
            });

            if (!res.ok) {
                throw new Error(`[ERROR WHEN UPLOADING PFP] status: ${res.status}`);
            }

            const updatedProfileInformation = await res.json();
            setProfile({ user: updatedProfileInformation.user }); // update profile immediately with new information

            await fetchUser(user.uid, token);
            setPreviewPfp(URL.createObjectURL(pfpFile));

            successNotify("Your profile was updated successfully!");
        } catch (error) {
            console.log("[FAILED TO UPDATE PFP]: ", error.message);
            handleCancel();
            errorNotify("There was an error editing your pfofile photo, please try again.");
        } finally {
            setPfpLoading(false);
            setIsEditingPfp(false);
        }
    }

    if (loading || editLoading || pfpLoading) return <ProfileLoadingSkeleton />;
    if (!profile) return <><h1>No profile found.</h1></>;
    
    return (
        <>
        <div className="flex flex-col items-center justify-center p-24">
            <div className="flex flex-col bg-base-300 rounded-lg items-center p-16 gap-2 shadow-2xl w-full max-w-4xl">
                {isEditingPfp ? 
                <>
                <form className="flex flex-col items-center w-full" onSubmit={handleFileUploaded}>
                <img src={previewPfp ? previewPfp : dbUser.pfp} className="w-50 h-50" />
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pick a file</legend>
                        <input type="file" className="file-input" accept="image/*" onChange={handleFileSelected}/>
                    <label className="label">Max size 2MB</label>
                </fieldset>
                <div className="flex p-4 gap-4 w-full justify-center">
                    <button type="submit" className="btn btn-neutral" disabled={!pfpFile}>Save</button>
                    <button type="button" className="btn btn-primary btn-outline" onClick={() => handleCancel("pfp")}>Cancel</button>
                </div>
                </form>
                </>
                :
                <>
                <img src={profile.user?.pfp === "" ? IconPlaceholder : profile.user?.pfp} className="w-50 h-50" />
                {isOwnProfile ? <button className="btn btn-ghost" onClick={() => setIsEditingPfp(true)}>Edit Profile Picture</button> : <></>}
                </>
                }
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

                            <p className="text-lg text-left"><b>Username</b></p>
                            <label className="input w-full">
                                { formData.username != profile.user?.username && usernameAvail !== null && <> {usernameAvail ? <p className="text-primary">Available!</p> : <p className="text-error">Not available!</p>} </>}
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    required
                                    placeholder={profile.user?.username}
                                    onChange={handleChange}
                                />
                            </label>

                            <p className="text-lg text-left"><b>Email</b></p>
                            <input type="text" placeholder={user.email} className="input" disabled />

                            <p className="text-lg text-left"><b>Bio</b></p> 
                            <textarea
                                id="bio"
                                name="bio"
                                maxLength={200}
                                className="w-full border border-base-content/20 rounded-md p-2 focus:outline-white"
                                value={formData.bio}
                                placeholder="Your bio can be up to 200 characters or you can have no bio at all! Mysterious."
                                onChange={handleChange}
                            />
                        </div>    
                        <div className="flex p-4 gap-4 w-full justify-center">
                                <button type="submit" className="btn btn-neutral disabled:cursor-not-allowed" disabled={usernameChecking || usernameAvail === false && formData.username !== profile.user?.username}>Save</button>
                                <button type="button" className="btn btn-primary btn-outline" onClick={() => handleCancel("info")}>Cancel</button>
                        </div>  
                </form>
                    
                </> : <>
                    <div className="flex items-center gap-2 justify-center w-full">
                        
                        <h1 className="text-3xl">
                            {profile.user?.displayName} {profile.user?.role === "admin" && <div class="badge badge-primary">Admin</div>}
                        </h1>
                        {isOwnProfile && <FaPen onClick={() => setIsEditing(true)} />}
                    </div>
                    <p className="opacity-65">@{profile.user?.username}</p>
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
                        <p className="w-full text-center">{profile.user?.bio === "" ? "No bio yet." : profile.user?.bio}</p>
                    </div>
                </>}
            </div>
        </div>
        </>
    )
}