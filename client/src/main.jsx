import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FallbackElement from "./components/FallbackElement.jsx"

import MainRoute from "./routes/MainRoute.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

const router = createBrowserRouter(MainRoute);

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<FallbackElement />} />
    </AuthProvider>
  </StrictMode>,
)