import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import FallbackElement from "../FallbackElement";

export default function SignUpPage(){
    const navigate = useNavigate();
    const { signInUser } = useAuth();
    const [loginLoading, setLoginLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false); // password visibility

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // update text fields accordingly when user types
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    // handle sign in with email and password
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("[LOGIN FORM SUBMITTED]: ", formData);
        setLoginLoading(true);

        try {
            const userCredential = await signInUser(formData.email, formData.password);

            // successful sign in
            const user = userCredential.user;
            console.log("[SIGNED IN USER]: ", user);
            setLoginLoading(false);

            navigate("/", { replace: true });
        } catch (error) {
            alert("Error signing in, please try again.");
            console.log("[ERROR SIGNING IN]: ", error.message);
        }
        setLoginLoading(false);
    }

    if (loginLoading) return <FallbackElement />

    return (
        <div className="flex flex-col items-center justify-center gap-5 p-24">
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box sm:w-xs md:w-lg lg:w-2xl border p-4">
                { /* email input */ }
                <label className="label">Email</label>
                <label className="input sm:w-xs md:w-lg lg:w-2xl">
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        required
                        placeholder="gleebus@gleepglorp.net"
                        onChange={handleChange}
                    />
                </label>
                <p className="validator-hint hidden">Enter valid email address</p>

                { /* password input */ }
                <label className="label">Password</label>
                <label className="input sm:w-xs md:w-lg lg:w-2xl">
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        required
                        placeholder="enter your password"
                        onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                        {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>

                <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
            </form>
        </div>
    )
}