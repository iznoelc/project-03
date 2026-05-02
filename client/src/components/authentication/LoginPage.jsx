import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpPage(){
    const [signUpLoading, setSignUpLoading] = useState(false);

    const [passwordVisibility, setPasswordVisibility] = useState(false); // password visibility 
    const [confirmPasswordVisibility, setconfirmPasswordVisibility] = useState(false); // password visibility 

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "creator",
    });

    const pwMatch = formData.password === formData.confirmPassword; // make sure password and confirm password fields match)

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pwMatch) return; // return if user's passwords do not match 
        console.log("Submitting form with data: ", formData);
        //setSignUpLoading(true);
    }

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
        </div>
    )
}