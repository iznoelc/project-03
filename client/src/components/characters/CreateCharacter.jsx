import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { errorNotify } from "../../utils/ToastifyNotifications";
import { createCharacter } from "../../utils/CreateDeleteCharacter";
import uploadToImgBB from "../../imgbb/imgbb";

export default function CreateCharacter(){
    const { user, dbUser } = useAuth();
    //const navigate = useNavigate();

    // Image variables
    const [iconFile, setIconFile] = useState(null);
    const [refFile, setRefFile] = useState(null);

    // preview image variables
    const [previewIcon, setPreviewIcon] = useState(null);
    const [previewRef, setPreviewRef] = useState(null);

    const [creatorChecked, setCreatorChecked] = useState(false); // for creator credit field

    const [formData, setFormData] = useState({
        owner_uid: user?.uid || "",
        name: "",
        bio: "",
        creator: "",
        iconImg: "",
        vis: "private",
        exportable: false,
        link: "",
        referenceImg: "",
        tags: []
    });

    //Handles all edits to the form data
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // Handles changes to the tags for the character
    const handleTagsChange = (e) => {
        const value = e.target.value;

        setFormData(prev => ({
        ...prev,
        tags: value
            .split(",")
            .map(q => q.trim())
            .filter(Boolean),
        }));
    };   
    
        
    const handleToggle = (e) => {
        const { name, checked } = e.target;

        if (name === "vis") {
            setFormData(prev => ({
            ...prev,
            vis: ! checked ? "public" : "private"
            }));
        } else {
            setFormData(prev => ({
            ...prev,
            [name]: !checked
            }));
        }
    };

    
    const handleIconSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIconFile(file);
        setPreviewIcon(URL.createObjectURL(file));
    };

    const handleRefSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setRefFile(file);
        setPreviewRef(URL.createObjectURL(file));
    };


    // Function to call create character from the createDeleteCharacter util
    const addCharacter = async () => {
        const { owner_uid, name, bio, creator, } = formData;

        // Basic validation
        if (!owner_uid){
            errorNotify("Owner UID is not valid: " + owner_uid);
        }
        if (!name.trim() || !creator || !bio.trim()) {
            console.log(name, creator, bio)
            console.log(dbUser);
            errorNotify("You are missing one or more required fields.");
            return;
        }

            let iconUrl = formData.iconImg;
            let refUrl = formData.referenceImg;

            // Upload icon if selected
            if (iconFile) {
                iconUrl = await uploadToImgBB(iconFile);
            }
            
            // Upload reference image if selected
            if (refFile) {
                refUrl = await uploadToImgBB(refFile);
            }

            const updatedForm = {
                ...formData,
                owner_uid: user.uid,
                iconImg: iconUrl,
                referenceImg: refUrl
            };
        

        await createCharacter(user, updatedForm);

        // Reset form
        setFormData({
            owner_uid: user.uid,
            name: "",
            bio: "",
            creator: "",
            iconImg: "",
            vis: "private",
            exportable: false,
            link: "",
            referenceImg: "",
            tags: []
        });
    };
    
    return (
        <>
        <div className="p-12 flex flex-col">
            <h1 className="text-center text-4xl">CHARACTER CREATION</h1>
            <h2 className="text-center">Starred fields are required.</h2>
            {/* Character Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Character Name*</legend>
              <input
                type="text"
                className="input w-full"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="i.e. Gleebus"
              />
            </fieldset>

            {/* Bio */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Character Bio*</legend>
            <textarea
                id="bio"
                name="bio"
                className="w-full h-64 border border-base-content/20 rounded-md p-2 focus:outline-white"
                value={formData.bio}
                placeholder="Give your character a bio! It can be about their description, personality, etc. And as long as you want!"
                onChange={handleChange}
            />
            </fieldset>

            {/* Creator */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Creator*</legend>
            

              <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={creatorChecked}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setCreatorChecked(checked);
                        setFormData({
                            ...formData,
                            creator: checked ? dbUser?.user?.username : "",
                        });
                    }}
                />
                I am the creator
            </label>

            {!creatorChecked && (
                <input
                type="text"
                className="input w-full"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                placeholder="Credit whoever designed your character!"
              />
            )}
            </fieldset>


            {/* Tags */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Character Tags (Comma Separated)
              </legend>
              <input
                type="text"
                className="input w-full"
                onChange={handleTagsChange}
                placeholder="Enter up to 3 tags."
              />
            </fieldset>
            
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Character Icon</legend>

                {previewIcon && (
                    <img src={previewIcon} className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="file-input w-full"
                    onChange={handleIconSelected}
                />
            </fieldset>

            { /* privacy and exportability */ }
            <div className="flex flex-col items-center gap-2 p-4">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box sm:w-sm md:w-lg lg:w-2xl border p-4">
                <legend className="fieldset-legend">Visibility*</legend>
                <label className="label justify-center">
                    Public
                    <input type="checkbox" defaultChecked className="toggle" 
                        name="vis"
                        onChange={handleToggle}
                    />
                    Private
                </label>
                <p className="text-center">Nobody but you will be able to see a private character.</p>
            </fieldset>
            
            
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box sm:w-sm md:w-lg lg:w-2xl border p-4">
                <legend className="fieldset-legend">Exportable*</legend>
                <label className="label justify-center">
                    Can Export
                    <input type="checkbox" defaultChecked className="toggle" 
                        name="exportable"
                        onChange={handleToggle}
                    />
                    Cannot Export
                </label>
                <p className="text-center">"Can export" will allow others to export information about your character!</p>
            </fieldset>
            </div>
            
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Reference Picture</legend>

                {previewRef && (
                    <img src={previewRef} className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="file-input w-full"
                    onChange={handleRefSelected}
                />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Optional External Link</legend>
              <input
                type="text"
                className="input w-full"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Wanna link an external source relating to your character? Put it here!"
              />
            </fieldset>

            {/* Actions */}
            <div className="modal-action justify-center">
              <button
                className="btn btn-primary"
                onClick={addCharacter}
              >
                Create Character
              </button>

            </div>
          </div>
        </>
    )
}
