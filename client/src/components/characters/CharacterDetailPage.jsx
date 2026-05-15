import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { FaPen, FaTrash, FaSave,  } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { TiExport } from "react-icons/ti";

import uploadToImgBB from "../../imgbb/imgbb";
import useAuth from "../../hooks/useAuth";

import CharacterDetailsLoadingSkeleton from "./CharacterDetailsLoadingSkeleton";

/**
 * DetailsPage.jsx
 * 
 * Character details fetched for the users to view in a nicer format. Also gives the user the ability to edit, export, or delete said character.
 * 
 * @author Esperanza Paulino
 */

export default function CharacterDetailPage() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [iconFile, setIconFile] = useState(null);
    const [refFile, setRefFile] = useState(null);

    const [previewCharaIcon, setPreviewCharaIcon] = useState(null);
    const [previewRefImg, setPreviewRefImg] = useState(null);

    const [characterOwner, setCharacterOwner] = useState(null);
    
    const [isOwnCharacter, setIsOwnCharacter] = useState(false);

    // Fetch character
    useEffect(() => {
        async function fetchCharacter() {
            setLoading(true);
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                console.log("Chaarcter data: ", data);
                setCharacter(data);
                setPreviewCharaIcon(data.iconImg);
                setPreviewRefImg(data.referenceImg);
                setIsOwnCharacter(data.owner_uid === user.uid);
                setFormData(data);

                // get the character's owner's information
                try {
                    const ownerRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${data.owner_uid}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (!ownerRes.ok){
                        throw new Error(`Failed to fetch character owner, status: ${ownerRes.status}`);
                    }

                    const ownerData = await ownerRes.json();
                    setCharacterOwner(ownerData);
                    
                } catch (error) {
                    console.error("Failed to fetch character owner:", error);
                }

            } catch (err) {
                console.error("Failed to load character:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCharacter();
    }, [id, user.uid]);

    //Note: These are not in helper functions due to variable definitions and the likes order
    // Handle input changes
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Save changes
    async function saveChanges() {
        setLoading(true);
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            // Copy form data
            const cleanBody = { ...formData };

            // Upload icon if a new file was selected
            if (iconFile) {
                cleanBody.iconImg = await uploadToImgBB(iconFile);
            }

            // Upload reference image if a new file was selected
            if (refFile) {
                cleanBody.referenceImg = await uploadToImgBB(refFile);
            }

            // Remove MongoDB fields
            delete cleanBody._id;
            delete cleanBody.__v;

            // Send PATCH request
            const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cleanBody)
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Character updated!");
            setCharacter(cleanBody);
            setIsEditing(false);

        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to update character.");
        } finally {
            setLoading(false);
        }
    }


    if (loading) return <CharacterDetailsLoadingSkeleton />;
    if (!character) return <div className="p-6 text-center">Character not found.</div>;

    return (
        <>
        {/* Buttons */}
        <div className="flex m-auto gap-4 p-1 pt-8">
            {isOwnCharacter && (
            <>
                {!isEditing ? (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <FaPen />Edit
                    </button>
                ) : (
                    <>
                        <button className="btn btn-success" onClick={saveChanges}><FaSave />Save</button>
                        <button
                            className="btn"
                            onClick={() => {
                                setFormData(character);
                                setIsEditing(false);
                                setPreviewCharaIcon(character?.iconImg);
                                setPreviewRefImg(character?.referenceImg);
                            }}
                        ><MdOutlineCancel />Cancel</button>
                    </>
                )}
                
                <button
                    className="btn btn-error"
                    onClick={() => deleteCharacterById(id)}
                ><FaTrash />Delete</button>
            </>
            )}

            {character.exportable &&
            <button
                className="btn btn-accent"
                onClick={() => exportCharacter(character)}><TiExport />Export</button>
            }
        </div>
        <div className="grid place-items-center p-4">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 bg-base-200 w-3xl justify-center items-center p-16">
                { /* left col */}
                <div className="flex flex-col items-center gap-6">                        
                    <div className="avatar">
                        <div className="mask mask-heart w-64">
                            {isEditing ? <img src={previewCharaIcon} /> : <img src={character.iconImg} alt={character.name} />}
                        </div>
                    </div>
                    {isEditing &&
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input w-full mt-2"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setIconFile(file);
                                setPreviewCharaIcon(URL.createObjectURL(file));
                            }}
                        />
                    }
                </div>

                { /* right col */ }
                <div className="flex flex-col text-center m-auto">
                        <div className="flex flex-col text-center gap-2 p-2">
                            {!isEditing ? (
                                <>
                                    
                                    <h1 className="text-4xl font-bold">{character.name}</h1>
                                    <div className="flex flex-wrap gap-1">
                                        {character.tags?.map(tag => (
                                            <span key={tag} className="badge badge-outline">{tag}</span>
                                        ))}
                                        {isOwnCharacter &&
                                            <>
                                            {character.vis === "public" ? 
                                                <div className="badge badge-soft badge-primary">Public</div> :
                                                <div className="badge badge-soft badge-secondary">Private</div>
                                            }
                                            </>
                                        }
                                    </div>
                                </>
                            ) : (<>
                                <input name="name" className="input input-bordered w-full" value={formData.name} onChange={handleChange} />
                                <input
                                    name="tags"
                                    className="input input-bordered w-full"
                                    value={formData.tags?.join(", ") || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: e.target.value.split(",").map(t => t.trim()).slice(0,3) // allow only 3 tags
                                        })
                                    }
                                    
                                />
                                <p className="text-xs opacity-50">Max 3 tags ({formData.tags?.length || 0}/3)</p>
                            </>)}
                            <p className="text-sm opacity-70 hover:cursor-pointer hover:underline" onClick={() => navigate(`/profile/${characterOwner?.user?.uid}`, { replace : true })}>Owned by {characterOwner?.user?.username}</p>
                            <p className="text-sm opacity-70">
                                Creator Credit: {!isEditing ? character.creator : (
                                    <input name="creator" className="input input-bordered w-full" value={formData.creator} onChange={handleChange} />
                            )}
                            </p>
                        </div>
                        
                    </div>

                    {/* span both columns for bio/other info (when editing.) */ }
                    <div className="col-span-2 w-full">
                        <div className="flex flex-col justify-center items-center gap-2 p-2">
                        <h1 className="text-3xl">Character Bio</h1>
                        {!isEditing ? (<>
                            <div className="h-12 overflow-y-auto resize bg-base-100 p-2">
                                {character.bio}
                            </div>
                        </>) : (<>
                            <textarea
                                name="bio"
                                className="textarea textarea-bordered w-full"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                            <h1>Edit Other Details</h1>
                            <select
                                name="vis"
                                className="select select-bordered w-full mb-2"
                                value={formData.vis}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        vis: e.target.value   // "public" or "private"
                                    }))
                                }
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>


                            <select
                                name="exportable"
                                className="select select-bordered w-full mb-2"
                                value={formData.exportable}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        exportable: e.target.value === "true"
                                    })
                                }
                            >
                                <option value="true">Exportable</option>
                                <option value="false">Not Exportable</option>
                            </select>
                            
                            <fieldset className="fieldset w-full mb-2">
                                <legend className="fieldset-legend">External Link</legend>
                                <input
                                    name="link"
                                    className="input input-bordered w-full"
                                    value={formData.link}
                                    onChange={handleChange}
                                />
                            </fieldset>
                        </>)}
                        
                        </div>
                    </div>
                </div>
            </div>

            {/* Reference Image */}
            <div className="flex flex-col w-3xl m-auto text-center justify-center bg-base-200 p-8 gap-4">
                <h1 className="text-3xl font-semibold mb-2">Reference Image</h1>

                {!isEditing ? (
                    <img
                        src={character.referenceImg}
                        alt="Reference"
                        className="rounded-lg max-w-full h-auto"
                    />
                ) : (<>
                    <img src={previewRefImg} className="rounded-lg max-w-full h-auto" />
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input w-full"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setRefFile(file);
                            setPreviewRefImg(URL.createObjectURL(file));
                        }}
                    />

                </>)}
            </div>
        </>
    )
}

/* ----------------------------------------------------
                helper functions
   (just for orgainizational purposes, not technical)
---------------------------------------------------- */

function confirmToast(message = "Are you sure?") {
    return new Promise((resolve) => {
        toast(({ closeToast }) => (
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
        ), {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            hideProgressBar: true,
        });
    });
}

async function deleteCharacterById(characterId) {
    const confirmed = await confirmToast("Delete this character?");
    if (!confirmed) return;

    try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${characterId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Delete failed");

        toast.success("Character deleted!");
        window.location.href = "/explore";
    } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete character.");
    }
}

function exportCharacter(character) {
    const blob = new Blob(
        [JSON.stringify(character, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${character.name.replace(/\s+/g, "_")}.json`;
    a.click();

    URL.revokeObjectURL(url);
}
