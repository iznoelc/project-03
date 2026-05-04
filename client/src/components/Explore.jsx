import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/Search";
import { FaRegStar, FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

/**
 * Explore.jsx
 * 
 * A page where users can search though the characters on the site
 * 
 * @author Landon Chapin
 */

export default function Explore(){

    const { user,} = useAuth(); 


    // Number of entries being shown to the user
    const [numShow, setNumShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);


    const [data, setData] = useState(null); // the job data
    const [sortType, setSortType] = useState("Date"); // default sort type
    const [ascending, setAscending] = useState(true); // default sort direction 

    const [searchQuery, setSearchQuery] = useState(""); // default search query - empty string
    const [searchType, setSearchType] = useState("Location"); //default search type



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

        /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    useEffect(() => {
        if (!user) return;
        fetchData(user)
    }, [user]);



    async function fetchData( user) {
        try {
            const token = await user.getIdToken();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/characters`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("FETCHED Character:", data);

            setData(data);
        } catch (err) {
            console.error("Failed to fetch Character:", err);
        }
    }



    return (
        <h1>This is the page to explore other user's characters.</h1>
    )
}