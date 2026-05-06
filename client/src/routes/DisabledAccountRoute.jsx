/**
 * DisabledAccountRoute.jsx
 * 
 * Outlines a route for redirecting user's with disabled accounts in order to limit the pages they can access.
 * 
 * @author Izzy Carlson
 */

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PrivateRoute = ({ children }) => {
  const { user, loading, accountStatus, extraDataLoading } = useAuth();

  // if authentication is still loading the user, show the fallback element
  if (loading || extraDataLoading) {
    return <FallbackElement />;
  }

  // if the user is not signed in, redirect them to the login page
  if (!user) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  // if the user is a recruiter and they are not yet approved
  if (accountStatus === "disabled") {
    return <Navigate to="/disabled"></Navigate>;
  }

  // user is a recruiter AND they are approved
  if (accountStatus === "active") {
    return children;
  }
};

export default PrivateRoute;