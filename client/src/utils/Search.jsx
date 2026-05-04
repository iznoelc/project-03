/**
 * Search.jsx
 * 
 * Allows search functionality
 * 
 * @author Landon Chapin
 */

function Search(data, searchQuery, searchType){
    // if data, searchQuery, or searchType are null or undefined, return the original data list (or an empty list if data is null)
    if (!data || !searchQuery || !searchType) return data || [];

    // set what user is searching for to a string and to lowercase for easier searching
    const value = searchQuery.toString().toLowerCase();

    // return list of filtered data based on search query and search type
    // change to lowercase and to string (for the year) to avoid simple grammar msistakes resulting in no results
        return data.filter(item => {
            switch (searchType) {
            case "name":
                return item.name.toLowerCase().includes(value);

            case "creator":
                return item.creator.toLowerCase().includes(value);

            case "tags":
                // Checks if any of three tags include the typed item
                if(item.tags[0].toString().toLowerCase().includes(value) || item.tags[1].toString().toLowerCase().includes(value) || item.tags[2].toString().toLowerCase().includes(value)){
                    return true;
                }
                else{return false;}


            default:
                return true;
            }
        });
}

export default Search;