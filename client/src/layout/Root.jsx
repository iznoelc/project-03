/**
 * Root.jsx
 * 
 * Sets up the root layout for all pages.
 * 
 * @author Izzy Carlson
 */

import { Outlet } from "react-router";
import NavBar from "../components/wrappers/NavBar";
import Footer from "../components/wrappers/Footer";

import FavoriteCharacterProvider from "../contexts/FavoriteCharacterProvider";

import { ToastContainer, Slide } from "react-toastify";

const Root = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <FavoriteCharacterProvider>
        <NavBar />
        
        <main className="flex-1 flex flex-col overflow-auto">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Slide}
            />
            <Outlet />
        </main>

        <Footer/>
        </FavoriteCharacterProvider>
      </div>
    </>
  );
};

export default Root;