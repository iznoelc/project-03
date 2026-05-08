/**
 * useFavoriteCharacters.jsx
 * 
 * Allows for favorite job functions to be used in other files.
 * 
 * @author Izzy Carlson
 */

import { useContext } from "react";
import { FavoriteCharacterContext } from "../contexts/FavoriteCharacterContext";

// export the context for use as a hook 
const useFavoriteCharacters = () => {
  const favCharacters = useContext(FavoriteCharacterContext);

  return favCharacters;
}

export default useFavoriteCharacters;