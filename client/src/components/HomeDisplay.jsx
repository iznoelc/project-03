import DataSorter from "../utils/DataSorter";
import { useState, useMemo, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { normalizeId } from "../utils/NormalizeCharacterId";
import { FaRegStar, FaStar } from "react-icons/fa";
import useFavoriteCharacters from "../hooks/useFavoriteCharacter";

export default function HomeDisplay(){

    const { user, favChars} = useAuth(); 

    // User array for display of creator display names
    const [users, setUsers] = useState({});


    const { addToFav, removeFromFav } = useFavoriteCharacters(); // use custom hook to get the favorites list and functions to add/remove movies from favorites
    const [characters, setCharacters] = useState([]); // Data for the characters being fetched
  
    const [loading, setLoading] = useState(true);

    /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    useEffect(() => {
        if (!user) return;
        fetchData(user)
    }, [user]);

    async function fetchData( user) {
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
        
        if (!res.ok) {
          throw new Error("Failed to fetch characters");
        }

        const data = await res.json();
        console.log("Fetched characters:", data);

        
        let filtered = data.filter(d => d.vis === "public");
        let sorted = DataSorter("date", false, filtered);
        let limited = sorted.slice(0, 9);

        setCharacters(limited);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }

    // check if movie is in favorites list by checking if the title of the movie is in the favorites list. return true if it is, false if it isnt.
    const isFavorite = (charId) => {
        return (favChars || []).some(fav =>
            normalizeId(fav) === charId.toString()
        );
    };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 " > 

        {characters.map((d, index) => (
                
                <div key={d._id} className="relative card  bg-base-100/5 card-xs shadow-sm">
 
  
                    {/* content */}
                    
                    <div className="block">
                    <div className="card bg-base-100/5  shadow-sm hover:shadow-md transition hover:scale-[1.02] cursor-pointer">

                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-2  p-8 grid-col-grow">
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

                            <div className="flex flex-col gap-2">
                                {/* put the title and description of the movie in the cards */}
                                <Link to={`/character/${d._id}`}  className="no-underline">
                                <h2 className="card-title primary-font text-[#ffffff] text-2xl hover:underline">
                                    {d.name}
                                </h2>
                                <h3 className="text-lg text-[#ffffff]">
                                {users[d.owner_uid]?.user?.displayName || "Unknown User"}
                                </h3>
                                </Link>
                                
                                
                            </div>
                            <div className="justify-middle card-actions">
                                <ul list>
                                    
                                    <div className="flex flex-row gap-2">
                                        <div className="flex gap-2">
                                            {d.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="badge badge-outline badge-primary text-[#ffffff]"
                                            >
                                                {tag}
                                            </span>
                                            ))}
                                        </div>

                                    </div>
                                    <div>
                                        
                                    {d.owner_uid !== user.uid && (
                                        <button
                                            className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer
                                            ${isFavorite(d._id) ? "text-primary hover:text-error" : "hover:text-success"} z-30`}
                                            onClick={
                                            isFavorite(d._id)
                                                ? () => removeFromFav(d.name, d._id)
                                                : () => addToFav(d.name, d)
                                            }
                                        >
                                            {isFavorite(d._id) ? <FaStar /> : <FaRegStar />}
                                        </button>
                                    )}
                                                                                
                                        
                                    </div>   
                                </ul>
                            </div>
                        </div>
                    </div>

                    </div>
                    </div>                    
                    
                </div>
            ))}
            </div>
            </>
        
    )

}