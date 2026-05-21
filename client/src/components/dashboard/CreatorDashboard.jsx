import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

//API DOCUMENTATION
//http://colormind.io/api-access/

/**
 * CreatorDashboard.jsx
 * 
 * Dashboard for users, contains your characters with more details view option and a pallette picker for inspiration.
 * 
 * @author Esperanza Paulino
 */

export default function CreatorDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userQuery, setUserQuery] = useState("");

    const [palette, setPalette] = useState([]);

    async function generate() {
        const result = await getPalette();
        setPalette(result);
    }

    // Fetch characters
    useEffect(() => {
        if (!user) return;
        fetchData(user);
    }, [user]);

    async function fetchData(user) {
        try {
            const token = await user.getIdToken();

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/characters`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch characters");

            const data = await res.json();
            setCharacters(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-16">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Only show characters owned by the logged‑in user
    const myCharacters = characters.filter(
        c => c.owner_uid === user.uid
    );

    // Apply search (name-only search)
    const filteredCharacters = Search(myCharacters, userQuery);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">Creator Dashboard</h1>
                <p className="opacity-70 mt-2">
                    Manage your characters, edit details, and create new content for all your creative endeavours!
                </p>
            </div>
            {/* Color API*/}
            <div>
                <p>Need inspiration? Generate a pallete for your character here!</p>
                <button className="btn btn-primary" onClick={generate}>
                    Generate Palette
                </button>

                <div className="flex gap-2 mt-4">
                    {palette.map((rgb, i) => (
                    <div
                        key={i}
                        className="w-16 h-16 rounded"
                        style={{ backgroundColor: `rgb(${rgb.join(",")})` }}
                    />
                    ))}
                </div>
                <p>Be sure to download the color sets you like so you can reference them later.</p>
                <button
                className="btn btn-primary"
                onClick={() => downloadPalette(palette)}
                >
                Export Palette
                </button>

                </div>
            {/* Search Input */}
            <input
                type="text"
                className="input input-bordered w-full max-w-md"
                placeholder="Search your characters..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
            />

            {/* No characters found */}
            {filteredCharacters.length === 0 && (
                <p className="text-center opacity-70 mt-6">
                    No characters found.
                </p>
            )}

            {/* Character Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map(char => (
                    <div
                        key={char._id}
                        className="card bg-base-200 shadow-xl hover:shadow-2xl transition"
                    >
                        <figure className="px-4 pt-4">
                            <div className="avatar">
                                <div className="mask mask-squircle w-24 h-24">
                                    <img
                                        src={char.iconImg}
                                        alt={char.name}
                                    />
                                </div>
                            </div>
                        </figure>

                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{char.name}</h2>
                            <p className="text-sm opacity-70">
                                {char.bio || "No description yet"}
                            </p>

                            <div className="card-actions mt-4">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/character/${char._id}`)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

// Simple name-only search helper
function Search(list, query) {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(item =>
        item.name.toLowerCase().includes(q)
    );
}

async function getPalette() {
  try {
    const res = await fetch("https://colormind.io/api/", {
      method: "POST",
      body: JSON.stringify({ model: "default" })
    });

    const data = await res.json();
    console.log("Palette:", data.result);
    return data.result;
  } catch (err) {
    console.error("Palette error:", err);
  }
}

function downloadPalette(colors) {
  const blob = new Blob(
    [JSON.stringify(colors, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "palette.json";
  a.click();

  URL.revokeObjectURL(url);
}

