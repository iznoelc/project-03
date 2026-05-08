/**
 * PrivateRoute.jsx
 * 
 * Outlines a private route that prevents nonlogged in users from accessing private pages.
 * 
 * @author Izzy Carlson
 */

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, role, extraDataLoading } = useAuth();

  // if authentication is still loading the user, show the fallback element
  if (loading || extraDataLoading || (user && !role)) {
    return <FallbackElement />;
  }

  // if the user is not signed in, redirect them to the login page
  if (!user || !allowedRoles) {
    console.log("Not allowed roles or not user.");
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  // if the user is signed in, but their role is not allowed access to the page, redirect them to the error page with 403 unauthorized access
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log("allowed roles and it does not include ", role);
    return <Navigate to="/error" state={{ code: 403 }}></Navigate>;
  }

  // user is signed in and has proper access
  if (allowedRoles && allowedRoles.includes(role)) {
    console.log("returning children");
    return children;
  }
};

export default PrivateRoute;