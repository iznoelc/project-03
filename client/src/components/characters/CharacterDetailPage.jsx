import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CharacterDetailPage() {
    const { id } = useParams(); // ← get character ID from URL
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCharacter() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${id}`);
                const data = await res.json();
                setCharacter(data.character || data); // depending on your backend shape
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
                    <div className="mask mask-star w-24">
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
                    className="rounded-lg max-h-96 object-cover"
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
                <button className="btn btn-error">Delete</button>
                <button className="btn btn-accent">Export</button>
            </div>

        </div>
    );
}
