import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateProfile,
} from "firebase/auth";
import useAuth from "../../hooks/useAuth";
import useUsernameCheck from "../../hooks/useUsernameCheck"

import FallbackElement from "../FallbackElement";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { successNotify, errorNotify } from "../../utils/ToastifyNotifications";

import { handleCreateUserInDatabase } from "../../auth/handleCreateUserInDatabase";

export default function SignUpPage(){
    const navigate = useNavigate();

    // auth
    const { createUser, loggedIn, fetchUser, signOutUser } = useAuth();
    const [signUpLoading, setSignUpLoading] = useState(false);

    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "creator",
        accountStatus: "active",
    });

    // username
    const { usernameAvail, usernameChecking } = useUsernameCheck(formData.username);

    // password and confirm password visibility
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [confirmPasswordVisibility, setconfirmPasswordVisibility] = useState(false); 
    const pwMatch = formData.password === formData.confirmPassword; // make sure password and confirm password fields match


    // update text fields accordingly when user types
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    }

    // handle sign up with email and password
    const handleSubmit = async () => {
        event.preventDefault();
        if (!pwMatch) return; // return if user's passwords do not match 
        if (usernameChecking) return; // have not yet determined if username is available
        if (!usernameAvail) return; // return if username is not available

        console.log("[SIGN UP FORM SUBMITTED]: ", formData);
        setSignUpLoading(true);
        try {
            const userCredential = await createUser(formData.email, formData.password);

            // successful sign up
            const user = userCredential.user;
            console.log(user);
            console.log("loggedIn: " + loggedIn);

            // create the user in the database
            const token = await user.getIdToken();
            await handleCreateUserInDatabase(token, user, formData, signOutUser);

            await updateProfile(user, {
                displayName: formData.displayName,
            });

            await fetchUser(user.uid, token, formData); // update user in auth provider ASAP

            successNotify("Account created successfully!")
            navigate("/", { replace: true });
        } catch (error) {
            errorNotify("There was an error creating your account. Please try again!");
            navigate("/login", { replace: true });
            console.log("Error creating user: ", error.message);
        }
        setSignUpLoading(false);
    }
    
    if (signUpLoading) return <FallbackElement />

    return (
        <div className="flex flex-col items-center justify-center gap-5 p-24">
            
            <form onSubmit={handleSubmit}>
                
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box sm:w-xs md:w-lg lg:w-2xl border p-4">
                
                { /* display name input */ }
                <label className="label">Display Name</label>
                <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    required
                    className="input sm:w-xs md:w-lg lg:w-2xl"
                    placeholder="enter your name"
                    minLength="2"
                    onChange={handleChange}
                />

                {/* username */}
                <label className="label">Username</label>
                <label className={`input sm:w-xs md:w-lg lg:w-2xl ${usernameAvail === null ? "input" : (usernameAvail ? "input-success" : "input-error")}`}>
                <input
                    type="text"
                    required
                    placeholder="enter username"
                    id="username"
                    name="username"
                    value={formData.username}
                    pattern="[A-Za-z][A-Za-z0-9_]*"
                    minLength="3"
                    maxLength="15"
                    title="Only letters, numbers or dash"
                    onChange={handleChange}
                />
                </label>
                <p className="validator-hint hidden">
                Must be 3 to 15 characters, containing only letters, numbers or 
                </p>
                {usernameAvail !== null && <>
                    { usernameAvail ?
                        <p className="text-success">Username available and valid!</p>
                            :
                        <p className="text-error">Username is not available, please try something else.</p>
                    }
                    
                </>}

                { /* email input */ }
                <label className="label">Email</label>
                <label className="input validator sm:w-xs md:w-lg lg:w-2xl">
                    <input
                        type="email"
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
                <label className="input validator sm:w-xs md:w-lg lg:w-2xl">
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        required
                        placeholder="enter your password"
                        minLength="8"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                        {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                </p>

                <label className="label">Confirm Password</label>
                <label className={`input sm:w-xs md:w-lg lg:w-2xl ${formData.confirmPassword === "" ? "input" : (pwMatch ? "input-success" : "input-error")}`}>
                    <input
                    type={confirmPasswordVisibility ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    required
                    placeholder="confirm your password"
                    onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setconfirmPasswordVisibility(!confirmPasswordVisibility)}>
                        {confirmPasswordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>
                {formData.confirmPassword !== "" &&
                <>
                    {pwMatch && formData.confirmPassword != ""? <p className="text-success">Passwords match!</p> : <p className="text-error">Passwords do not match!</p>}
                </>
                }

                <button className="btn btn-neutral mt-4">Create My Account</button>
                
            </fieldset>
            </form>
            <p className="secondary-font mt-4 text-center"><i>OR</i></p>
            <button type="button" className="btn btn-neutral mt-4"><FcGoogle /> Sign up with Google</button>
        </div>
    )
}