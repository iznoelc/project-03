/**
 * FavoriteJobProvider.jsx
 * 
 * Outlines functions for removing and adding favorite jobs from the current user's favorite jobs list.
 * 
 * @author Izzy Carlson
 */

import useAuth from "../hooks/useAuth";
import { FavoriteCharacterContext } from "./FavoriteCharacterContext";
import { normalizeId } from "../utils/NormalizeCharacterId";
import { errorNotify, successNotify } from "../utils/ToastifyNotifications";
import { postNotification } from "../utils/Notifications";


// set up what the context will do. for favorite movies, it creates functions to add to favorites, remove from favorites, and the favorites list
// make sure it takes children as a prop, because this allows all components wrapped in this component access to the context.
export default function FavoriteJobProvider({children}) {
  const { user, favChars, setFavChars, fetchUser, dbUser } = useAuth();

    /* add a movie to the favorites list, but dont add it if its already in the list. if its already in the list, give an alert */
    const addToFav = async (characterName, characterObject, characterOwner) => {
          try {
              const cleanFavCharacters = (favChars || []).map(normalizeId);
              // const updatedFavJobs = [...cleanFavJobs, jobObject];
              const newId = normalizeId(characterObject);
              setFavChars([...cleanFavCharacters, newId]);
              const token = await user.getIdToken();
              const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
              method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    favChars: [...cleanFavCharacters, normalizeId(characterObject)]
                  }),
              });
      
              if (!res.ok){
                  throw new Error(`HTTP error! status: ${res.status}`);
              }

              console.log("Posting notif");
              
              const notifType = "NEW FAVORITE";
              const notifBody = dbUser.user?.username + " liked your character " + characterName;

              await postNotification(user.uid, characterOwner, notifType, notifBody, token);

              // setFavJobs(updatedFavJobs);
              await fetchUser(user.uid, await user.getIdToken()); // re-fetch populated data
              successNotify("Successfully added " + characterName + " to favorites character list!");
          } catch (err) {
            console.error("AddToFav error:", err);
            errorNotify("Error adding " + characterName + " to favorites character list, try again.");
          }

    };
  
    /* remove a character from the favorites list. It takes in a job object as an argument and updates the favMovies state by filtering out the movie with the matching title. */
    const removeFromFav = async (characterName, characterId) => {
      try {
        // const cleanFavJobs = favJobs.map(normalizeId);
        // const updatedFavJobs = cleanFavJobs.filter(
        //     job => job !== jobId
        // );

        const updatedFavCharacters = favChars.filter(character => normalizeId(character) !== characterId)
        setFavChars(updatedFavCharacters);
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
        method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({
              favChars: updatedFavCharacters.map(normalizeId),
            }),
        });

        if (!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        setFavChars(updatedFavCharacters);
        successNotify("Successfully removed " + characterName + " from favorites character list!");
    } catch (err) {
    console.error("RemoveFromFav error:", err);
    errorNotify("Error removing " + characterName + " to favorites character list, try again.");
    }

    };

  return (
    // provide the context value to the children components
    <FavoriteCharacterContext.Provider value={{ addToFav, removeFromFav }}>
      {children}
    </FavoriteCharacterContext.Provider>
  );
}