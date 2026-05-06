import { Slide, toast } from "react-toastify";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

export const errorNotify = (msg) => toast.error(msg, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: prefersDark ? "dark" : "light",
    transition: Slide,
});

export const successNotify = (msg) => toast.success(msg, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: prefersDark ? "dark" : "light",
    transition: Slide,
});