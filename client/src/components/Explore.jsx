import { useState, useMemo, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FallbackElement from "../components/FallbackElement";


/**
 * Explore.jsx
 * 
 * A page where users can search though the characters on the site
 * 
 * @author Landon Chapin
 */

export default function Explore(){

  const { user } = useAuth();

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

        setCharacters(data.filter(data => data.vis === "public"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }
    
    if (loading) {
        return (
            <FallbackElement />
        );
    }



    return (
        <>
        <h1 className="primary-font text-4xl text-center my-8">
            Explore Characters
        </h1>

        <SearchBar data={characters} />
        </>


    )
}