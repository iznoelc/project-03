import useAuth from "../../hooks/useAuth";
import SearchBar from "../../components/SearchBar";
import { useState, useMemo, useEffect } from "react";

export default function FavoriteCharacterDashboard(){

    const { user, dbUser } = useAuth();

    const [characters, setCharacters] = useState([]); // Data for the characters being fetched
  
    const [loading, setLoading] = useState(true);


    /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    /*useEffect(() => {
        if (!user || !dbUser) return;
        fetchData(user);
    }, [user, dbUser]);
    */
    

    useEffect(() => {
        if (!user || !dbUser) return;
        fetchData(user);
    }, [user, dbUser]);


    
    async function fetchData(user) {
        try {
            const token = await user.getIdToken();

            // Fetch all favorites in parallel
            const requests = (dbUser.user?.favChars || []).map((d) =>
                fetch(`${import.meta.env.VITE_API_URL}/characters/${d._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch character");
                    }
                    return res.json();
                })
            );

            // Wait for all results
            const results = await Promise.all(requests);

            // Filter public characters
            const filtered = results.filter(c => c.vis === "public");

            console.log("Fetched favorites:", filtered);

            setCharacters(filtered);

        } catch (err) {
            console.error("Fetch error:", err);
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


    return (
        <>
            <h1>Your Favorite Characters</h1>

            <SearchBar data={characters} />

        </>
    )
}