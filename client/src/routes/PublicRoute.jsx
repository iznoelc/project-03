/**
 * PublicRoute.jsx
 * 
 * Outlines a route that prevents logged in users from accessing authenticated pages.
 * 
 * @author Izzy Carlson
 */

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PublicRoute = ({ children }) => {
  const { user, loading, extraDataLoading } = useAuth();

  // if authentication is still loading the user, show the fallback element
  if (loading || extraDataLoading) {
    return <FallbackElement />;
  }

  // if the user is signed in, redirect them to the explore page
  if (user) {
    return <Navigate to="/explore"></Navigate>;
  }

  return children;
};

export default PublicRoute;