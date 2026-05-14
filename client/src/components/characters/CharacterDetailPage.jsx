import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

export default function CharacterDetailPage() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [characterOwner, setCharacterOwner] = useState(null);
    
    const [isOwnCharacter, setIsOwnCharacter] = useState(false);

    // Fetch character
    useEffect(() => {
        async function fetchCharacter() {
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                console.log("Chaarcter data: ", data);
                setCharacter(data);
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
    }, [id]);

    //Note: These are not in helper functions due to variable definitions and the likes order
    // Handle input changes
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Save changes
    async function saveChanges() {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const { ...cleanBody } = formData;

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
            setCharacter(formData);
            setIsEditing(false);
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to update character.");
        }
    }

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!character) return <div className="p-6 text-center">Character not found.</div>;

    return (
        <>
        <div className="grid place-items-center pt-16">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 bg-base-200 max-w-5xl justify-center items-center p-16">
                { /* left col */}
                <div className="flex items-center gap-6">                        
                    <div className="avatar">
                        <div className="mask mask-heart w-64">
                            <img src={character.iconImg} alt={character.name} />
                        </div>
                    </div>
                </div>

                { /* right col */ }
                <div className="flex flex-col items-center text-center">
                        <div className="flex flex-col text-center gap-2 p-2">
                            {!isEditing ? (
                                <h1 className="text-4xl font-bold">{character.name}</h1>
                            ) : (
                                <input name="name" className="input input-bordered w-full" value={formData.name} onChange={handleChange} />
                            )}
                            <p className="text-sm opacity-70 hover:cursor-pointer hover:underline" onClick={() => navigate(`/profile/${characterOwner?.user?.uid}`, { replace : true })}>Owned by {characterOwner?.user?.username}</p>
                            <p className="text-sm opacity-70">
                                Creator Credit: {!isEditing ? character.creator : (
                                    <input name="creator" className="input input-bordered w-full" value={formData.creator} onChange={handleChange} />
                                )}
                            </p>
                            <button className="btn btn-primary">Reference</button>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        
        

            {/* Avatar + Name */}
            <div className="flex items-center gap-6">
                <div className="avatar">
                    <div className="mask mask-heart w-24">
                        <img src={character.iconImg} alt={character.name} />
                    </div>
                </div>

                <div>
                    {!isEditing ? (
                        <h1 className="text-4xl font-bold">{character.name}</h1>
                    ) : (
                        <input
                            name="name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    )}

                    <p className="text-sm opacity-70">
                        Created by: {!isEditing ? (
                            character.creator
                        ) : (
                            <input
                                name="creator"
                                className="input input-bordered w-full"
                                value={formData.creator}
                                onChange={handleChange}
                            />
                        )}
                    </p>
                </div>
            </div>

            {/* Bio */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Bio</h2>

                {!isEditing ? (
                    <p>{character.bio}</p>
                ) : (
                    <textarea
                        name="bio"
                        className="textarea textarea-bordered w-full"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                )}
            </div>

            {/* Tags */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>

                {!isEditing ? (
                    <div className="flex flex-wrap gap-2">
                        {character.tags?.map(tag => (
                            <span key={tag} className="badge badge-outline">{tag}</span>
                        ))}
                    </div>
                ) : (
                    <input
                        name="tags"
                        className="input input-bordered w-full"
                        value={formData.tags?.join(", ") || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                tags: e.target.value.split(",").map(t => t.trim())
                            })
                        }
                    />
                )}
            </div>

            {/* Reference Image */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Reference Image</h2>

                {!isEditing ? (
                    <img
                        src={character.referenceImg}
                        alt="Reference"
                        className="rounded-lg max-h-96 w-40 object-cover"
                    />
                ) : (
                    <input
                        name="referenceImg"
                        className="input input-bordered w-full"
                        value={formData.referenceImg}
                        onChange={handleChange}
                    />
                )}
            </div>

            {/* Details */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Details</h2>

                {!isEditing ? (
                    <>
                        <p><strong>Visibility:</strong> {character.vis}</p>
                        <p><strong>Exportable:</strong> {character.exportable ? "Yes" : "No"}</p>
                        <p><strong>Link:</strong> {character.link}</p>
                    </>
                ) : (
                    <>
                        <input
                            name="vis"
                            className="input input-bordered w-full mb-2"
                            value={formData.vis}
                            onChange={handleChange}
                        />

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

                        <input
                            name="link"
                            className="input input-bordered w-full"
                            value={formData.link}
                            onChange={handleChange}
                        />
                    </>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                {isOwnCharacter && (
                    <>
                {!isEditing ? (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                ) : (
                    <>
                        <button className="btn btn-success" onClick={saveChanges}>
                            Save
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setFormData(character);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
                
                

                <button
                    className="btn btn-error"
                    onClick={() => deleteCharacterById(id)}
                >
                    Delete
                </button>
                </>
                )}

                <button
                    className="btn btn-accent"
                    onClick={() => exportCharacter(character)}
                >
                    Export
                </button>
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
        window.location.href = "/characters";
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
