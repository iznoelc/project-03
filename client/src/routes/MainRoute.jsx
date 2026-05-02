// import PrivateRoute from "./PrivateRoute";
// import PublicRoute from "./PublicRoute"

import FallbackElement from "../components/FallbackElement";
import Home from "../components/Home";
import ErrorPage from "../components/ErrorPage";

import Root from "../layout/Root";

import Explore from "../components/Explore"

import CreatorDashboard from "../components/dashboard/CreatorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import FavoriteCharacterDashboard from "../components/dashboard/FavoriteCharacterDashboard";

import SignUpPage from "../components/authentication/SignUpPage";
import LoginPage from "../components/authentication/LoginPage";
import ForgotPassword from "../components/authentication/ForgotPassword";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,
        HydrateFallback: FallbackElement,
      },
        { path: "*", Component: ErrorPage },

        { path: "explore",
          element: (
            <Explore />
          )
        },

        { path: "creator-dashboard",
          element: (
            <CreatorDashboard />
          )
        },

        { path: "admin-dashboard",
          element: (
            <AdminDashboard />
          )
        },

        { path: "favorites-dashboard",
          element: (
          <FavoriteCharacterDashboard />
          )
        },

        { path: "signup",
          element: (
            <SignUpPage />
          )
        },

        { path: "login",
          element: (
            <LoginPage />
          )
        },

        { path: "forgot-password",
          element: (
            <ForgotPassword />
          )
        },
    ],
  },
//   { path: "*", Component: ErrorPage }, {path: "/error", Component: ErrorPage}
];

export default MainRouter;