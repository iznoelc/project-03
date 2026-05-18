import DataSorter from "../utils/DataSorter";
import { useState, useMemo, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { normalizeId } from "../utils/NormalizeCharacterId";
import { FaRegStar, FaStar } from "react-icons/fa";
import useFavoriteCharacters from "../hooks/useFavoriteCharacter";

export default function HomeDisplay(){

    const { user, favChars, loggedIn } = useAuth(); 

    // User array for display of creator display names
    const [users, setUsers] = useState({});


    const { addToFav, removeFromFav } = useFavoriteCharacters(); // use custom hook to get the favorites list and functions to add/remove movies from favorites
    const [characters, setCharacters] = useState([]); // Data for the characters being fetched
  
    const [loading, setLoading] = useState(true);

    /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    useEffect(() => {
        fetchData()
    }, [user]);

    async function fetchData() {
        setLoading(true);
        try {
            //const token = await user.getIdToken();

            const res = await fetch(
            `${import.meta.env.VITE_API_URL}/characters/get-latest`);
        
            if (!res.ok) {
                throw new Error(`Failed to fetch characters, Status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Fetched characters:", data);

            
            let filtered = data.filter(d => d.vis === "public");
            let sorted = DataSorter("date", false, filtered);
            let limited = sorted.slice(0, 10);

            setCharacters(limited);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }

    // Function to fetch the user names
    async function fetchCharacterCreators(user) {
        try {
            const token = await user.getIdToken();

            // get unique owner IDs
            const uniqueIds = [...new Set(characters.map(d => d.owner_uid))];

            const results = await Promise.all(
                uniqueIds.map(async (uid) => {
                    const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/users/${uid}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!res.ok) {
                        console.warn("Failed to fetch user:", uid);
                        return null;
                    }

                    const userData = await res.json();
                    console.log("Fetching user:", uid);

                    return { uid, userData };
                })
            );

            // convert to lookup object
            const userMap = {};
            results.forEach(result => {
                if (result) {
                    userMap[result.uid] = result.userData;
                }
            });

            setUsers(userMap);
            console.log("User map:", userMap);

        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }

    // Use effect for getting user names for the display
    useEffect(() => {
        if (!user || characters.length === 0) return;

        fetchCharacterCreators(user);
    }, [user, characters]);    
    
    if (loading) {
        return (
        <div className="flex justify-center items-center p-16">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
        );
    }

    return(
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4" > 

        {characters.map((d) => (
                
                <div key={d._id} className="relative card  bg-base-100 card-xs shadow-sm">
 
  
                    {/* content */}
                    <div className="block">
                    <div className="card bg-base-100 shadow-sm hover:shadow-md transition hover:scale-[1.02] cursor-pointer">

                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-2 p-8 grid-col-grow">
                            {d.iconImg ? (
                            <img
                                src={d.iconImg}
                                alt={d.name}
                                className="w-full h-40 object-cover rounded-xl"
                            />
                            ) : (
                            <div className="w-full h-40 flex items-center justify-center bg-base-300 rounded-xl">
                                <span className="text-sm opacity-70">No Image</span>
                            </div>
                            )}

                            <div className="flex flex-col flex-wrap gap-2">
                                {/* put the title and description of the movie in the cards */}
                                <h2 className="card-title primary-font text-2xl">
                                    {d.name}
                                </h2>
                                <h3 className="text-lg">
                                    {loggedIn && (d.owner_uid !== null ? `@${users[d.owner_uid]?.user?.username}` : "Unknown User")}
                                
                                </h3>
                                
                                
                            </div>
                        </div>
                    </div>

                    </div>
                    </div>                    
                    <div className="flex flex-row gap-2 flex-wrap col-span-2 w-full p-4 justify-center">
                        {d.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="badge badge-outline badge-primary"
                        >
                            {tag}
                        </span>
                        ))}
                    </div>
                </div>
            ))}
            </div>
            </>
        
    )

}