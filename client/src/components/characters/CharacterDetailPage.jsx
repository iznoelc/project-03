import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function CharacterDetailPage() {
    const { id } = useParams(); // ← get character ID from URL
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchCharacter() {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("Fetched character:", data);
            setCharacter(data);
        } catch (err) {
            console.error("Failed to load character:", err);
        } finally {
            setLoading(false);
        }
    }

    fetchCharacter();
}, [id]);


    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!character) return <div className="p-6 text-center">Character not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Avatar and Name */}
            <div className="flex items-center gap-6">
                <div className="avatar">
                    <div className="mask mask-heart w-24">
                        <img src={character.iconImg} alt={character.name} />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-bold">{character.name}</h1>
                    <p className="text-sm opacity-70">Created by: {character.creator}</p>
                </div>
            </div>

            {/* Bio */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p>{character.bio}</p>
            </div>

            {/* Tags */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {character.tags?.map(tag => (
                        <span key={tag} className="badge badge-outline">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Reference Image */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Reference Image</h2>
                <img
                    src={character.referenceImg}
                    alt="Reference"
                    className="rounded-lg max-h-96 w-40 object-cover"
                />
            </div>

            {/* Visibility and Exportable */}
            <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <p><strong>Visibility:</strong> {character.vis}</p>
                <p><strong>Exportable:</strong> {character.exportable ? "Yes" : "No"}</p>
                <p><strong>Link:</strong> {character.link}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button className="btn btn-primary">Edit</button>
                <button
                    className="btn btn-accent"
                    onClick={() => exportCharacter(character)}
                >
                    Export
                </button>
                <button
                    className="btn btn-error"
                    onClick={() => deleteCharacterById(id)}
                >
                    Delete
                </button>
            </div>

        </div>
    );
}

// Reusable confirm dialog
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

// DELETE CHARACTER
async function deleteCharacterById(characterId) {
    const confirmed = await confirmToast("Delete this character?");
    if (!confirmed) return;

    try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${characterId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        toast.success("Character deleted!");
        return true;
    } catch (err) {
        console.error("Error deleting character", err);
        toast.error("Failed to delete character.");
        return false;
    }
}

// EXPORT CHARACTER (download JSON)
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

