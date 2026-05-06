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
    const [user, setUser] = useState(null); // the user
    const [dbUser, setDbUser] = useState(null);
    const [role, setRole] = useState(null); // their role (admin or creator)
    const [accountStatus, setAccountStatus] = useState(null); // their account status (active [default] or disabled)
    const [favChars, setFavChars] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [extraDataLoading, setExtraDataLoading] = useState(true);

    const createUser = (email, password) => { return createUserWithEmailAndPassword(auth, email, password); };

    const signInUser = (email, password) => { return signInWithEmailAndPassword(auth, email, password); };

    const signInWithGoogle = () => { return signInWithPopup(auth, googleProvider); };

    const signOutUser = () => { return signOut(auth); };

    const sendPasswordReset = (email) => { return sendPasswordResetEmail(auth, email); }

    // onAuthStateChanged useEffect 
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("[AUTH STATE CHANGED]: ", currentUser);
        // if the current user is null, make sure everything else is null/empty too and return
        if (!currentUser){
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(currentUser);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }, []);

    useEffect(() => {
      if (!user) return;

      const loadExtraData = async () => {
        setExtraDataLoading(true);
        // try fetching the user's additional data
        try {
          const token = await user.getIdToken();
          console.log("[LOAD EXTRA DATA] fetching for uid:", user.uid);
          let res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status === 404){
            console.log("[LOAD EXTRA DATA 404 - TRYING AGAIN IN 2s");
            setTimeout(loadExtraData, 2000);
            return; 
          }
          if (!res.ok){
            throw new Error("FAILED TO FETCH USER DATA [ROLE, ACCOUNT STATUS, FAV CHARAS]");
          }

          const data = await res.json();
          console.log("[USER DATA FETCHED]: ", data);
          setRole(data.user?.role || data.role);
          setAccountStatus(data.user?.accountStatus || data.accountStatus);
          setFavChars(data.user?.favChars || data.favChars);
          setDbUser(data.user);
        } catch (error) {
          console.log("[ERROR FETCHING USER ROLE, ACCOUNT STATUS, OR FAVORITE CHARACTERS]: ", error.message);
          setRole(null);
          setAccountStatus(null);
          setFavChars([]);
        }
        setExtraDataLoading(false);
      }

      loadExtraData();

    }, [user]);
    
    // fetch the user for immediate update after sign in
    const fetchUser = async (uid, token) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("FAILED USER FETCH FROM FETCH USER IN AUTH PROVIDER");

      const data = await res.json();

      setRole(data.user?.role || data.role);
      setAccountStatus(data.user?.accountStatus || data.accountStatus);
      setFavChars(data.user?.favChars || data.favChars);
      setDbUser(data.user);
    };

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
      fetchUser,
      user,
      role,
      accountStatus,
      favChars,
      setFavChars,
      loading,
      extraDataLoading,
      loggedIn: !!user,
      dbUser,
    };
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
  };

  export default AuthProvider;