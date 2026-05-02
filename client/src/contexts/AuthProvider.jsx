/** AuthProvider.jsx
 * 
 * 
 */

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext";
import FallbackElement from "../components/FallbackElement";

const googleProvider = new GoogleAuthProvider();

// passing a children prop -->
const AuthProvider = ({ children }) => {
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  const sendPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // prevents error if auth is still loading and the user is trying to access a protected route
  // i.e. if user is trying to access dashboard and refreshes, prevents an error from showing if they are already logged in 
  if (loading) {
    return <div className="pt-64"><FallbackElement /></div>;
  }

  // all variables that should be passed from this provider to its children so it can be used in all child components
  const authInfo = {
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    user,
    loading,
    loggedIn: !!user,
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;