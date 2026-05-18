import DataSorter from "../utils/DataSorter";
import Search from "../utils/Search";
import { useState, useMemo, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { normalizeId } from "../utils/NormalizeCharacterId";
import useFavoriteCharacters from "../hooks/useFavoriteCharacter";
import { FaRegStar, FaStar } from "react-icons/fa";

/**
 * SearchBar.jsx
 * 
 * A function that is used by other pages to generate a search bar
 * 
 * Must be fed the data for the search bar
 * 
 * @author Landon Chapin
 */


export default function SearchBar({ data: initialData }){


    const { dbUser, user, favChars, role } = useAuth(); 

    // User array for display of creator display names
    const [users, setUsers] = useState({});

    const { addToFav, removeFromFav } = useFavoriteCharacters(); // use custom hook to get the favorites list and functions to add/remove movies from favorites

    //console.log("favCharacters:", favChars);

    // Number of entries being shown to the user
    const [numShow, setNumShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);


    const data = initialData || [];
    const [sortType, setSortType] = useState("name"); // default sort type
    const [ascending, setAscending] = useState(true); // default sort direction 

    const [searchQuery, setSearchQuery] = useState(""); // default search query - empty string
    const [searchType, setSearchType] = useState("name"); //default search type



    /* use useMemo to cache the result of Search that its only updated when its dependencies change. 
       if searchQuery, searchType, or data are updated, the result of Search will also update to display the 
       new filteredData.
     */ 
    const filteredData = useMemo(() => {
        if (!data) return []; // if there is no data, return null for filteredData
        return Search(data, searchQuery, searchType);
    }, [searchQuery, searchType, data]);
      

    /* use useMemo to cache the result of DataSorter (jnside sortedData) that its only updated when its dependencies change. 
       if data, sortType, or ascending are updated, the result of DataSorter will also update to display the 
       new sortedData.
     */ 
    const sortedData = useMemo(() => {
        // if there is no filtered data, just use the normal data list
        if (!filteredData){
            console.log("Data is null");
            return DataSorter(sortType, ascending, data);
        }
        // otherwise, sort the filtered data
        return DataSorter(sortType, ascending, filteredData);
    }, [filteredData, sortType, ascending, data]);


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
            const uniqueIds = [...new Set(data.map(d => d.owner_uid))];

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
        if (!user || data.length === 0) return;

        fetchCharacterCreators(user);
    }, [user, data]);




    return (
        <>
        <div className="flex items-center justify-center gap-5 w-screen">
            {/* search bar */}
            <select onChange={(e) => setSearchType(e.target.value)} className="secondary-font">
                <option value="name">Name</option>
                <option value="creator">Creators</option>
                <option value="tags">Tags</option>
            </select>
            <label className="input input-bordered input-m w-lg">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" required placeholder="Search for Characters..." onChange={(e) => setSearchQuery(e.target.value)}/>
            </label>
            {/* drop down menu for search type */}
            <div className="dropdown dropdown-hover">
                <div tabIndex="0" role="button" className="btn m-1 secondary-font">SORT...</div>
                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg">
                        <li><a onClick={() => setSortType("name")}>By Character Name</a></li>
                        <li><a onClick={() => setSortType("creator")}>By Creator</a></li>
                        <li><a onClick={() => setSortType("tags")}>By Tag</a></li>
                    </ul>
            </div>
            {/* ascending/descending checkbox */}
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-32 border p-4">
                <legend className="fieldset-legend secondary-font">Sorting Options</legend>
                <label className="label secondary-font">
                    <input type="checkbox" defaultChecked className="checkbox" onChange={() => setAscending(!ascending)}/>
                    Ascending Order
                </label>
                <label className="label secondary-font"> Number of Characters Shown </label>
                  <select
                    value={numShow}
                    className="select"
                    onChange={(e) => {
                      setNumShow(Number(e.target.value));
                      setCurrentPage(0); // reset pagination
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
            </fieldset>
        </div>
        
        {/* To be displayed if data is not loading and the current data length is bigger than zero */}
        {sortedData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4" > 

            {sortedData.slice(currentPage * numShow, numShow + (currentPage * numShow) ).map((d, index) => (
                
                <div key={d._id} className="relative card  bg-base-100 card-xs shadow-sm">
 
  
                    {/* content */}
                    
                    <div className="block">
                    <div className="card bg-base-100 shadow-sm hover:shadow-md transition hover:scale-[1.02] cursor-pointer">

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
                                <h2 className="card-title primary-font text-2xl hover:underline">
                                    {d.name}
                                </h2>
                                <h3 className="text-lg">
                                @{users[d.owner_uid]?.user?.username || "Unknown User"}
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
                                                className="badge badge-outline badge-primary"
                                            >
                                                {tag}
                                            </span>
                                            ))}
                                        </div>

                                    </div>
                                    <div>
                                        {(d.owner_uid !== user.uid && dbUser?.accountStatus !== "disabled" && role !== "admin") && (
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
        )}
        <div className="flex justify-center gap-4 p-8">
          <button
            className="btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          <span className="secondary-font">
            Page {currentPage + 1}
          </span>

          <button
            className="btn"
            disabled={(currentPage + 1) * numShow >= sortedData.length }
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>

        {/* To be displayed if data is not loading and the current data length is zero (i.e. no search results) */}
        {sortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 p-16">
                <h1 className="secondary-font text-2xl">No Characters found.</h1>
            </div>
        )}

        </>

    )


}