/**
 * useAuth.jsx
 * 
 * Allows for fields from AuthProvider to be used in other files.
 * 
 * @author Izzy Carlson
 */

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const authInfo = useContext(AuthContext);
  return authInfo;
};

export default useAuth;