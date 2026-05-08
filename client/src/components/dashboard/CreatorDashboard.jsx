import { useNavigate } from "react-router-dom";

export default function CreatorDashboard({ characters = [] }) {
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">Creator Dashboard</h1>
                <p className="opacity-70 mt-2">
                    Manage your characters, edit details, and create new content for all your creative endeavours!
                </p>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {characters.map((char) => (
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
                                {char.tagline || "No description yet"}
                            </p>

                            <div className="card-actions mt-4">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/character/${char._id}`)} //heres where we would connect to the details page, just did silly fake connector 4 right now
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
