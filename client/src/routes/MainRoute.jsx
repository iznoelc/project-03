import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"
import DisabledAccountRoute from "./DisabledAccountRoute";

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

import CreateCharacter from "../components/characters/CreateCharacter";
import DisabledAccountPage from "../components/DisabledAccountPage";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,
        HydrateFallback: FallbackElement,
      },
        { path: "explore",
          element: (
            <Explore />
          )
        },

        { path: "creator-dashboard",
          element: (
            <PrivateRoute allowedRoles={["creator"]}>
              <CreatorDashboard />
            </PrivateRoute>
          )
        },

        { path: "characters/create",
          element: (
            <PrivateRoute allowedRoles={["creator"]}>
              <DisabledAccountRoute>
                <CreateCharacter />
              </DisabledAccountRoute>
            </PrivateRoute>
          )
        },

        { path: "admin-dashboard",
          element: (
            <PrivateRoute allowedRoles={["admin"]}>
              <DisabledAccountRoute>
                <AdminDashboard />
              </DisabledAccountRoute>
            </PrivateRoute>
          )
        },

        { path: "favorites-dashboard",
          element: (
            <PrivateRoute allowedRoles={["creator"]}>
              <FavoriteCharacterDashboard />
            </PrivateRoute>
          )
        },

        { path: "signup",
          element: (
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          )
        },

        { path: "login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          )
        },

        { path: "forgot-password",
          element: (
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          )
        },
        
        {
          path: "disabled",
          element: (
            <PrivateRoute allowedRoles={["creator", "admin"]}>
              <DisabledAccountPage />
            </PrivateRoute>
          )
        }
    ],
  },
  { path: "*", Component: ErrorPage }, {path: "/error", Component: ErrorPage}
];

export default MainRouter;