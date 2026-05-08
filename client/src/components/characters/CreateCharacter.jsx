import { useState, useMemo, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";
import { createCharacter } from "../../utils/CreateDeleteCharacter";
import uploadToImgBB from "../../imgbb/imgbb";

export default function CreateCharacter(){
    const { user } = useAuth();

    const [characters, setCharacters] = useState([]); // Data for the characters being fetched

    // Image variables
    const [iconFile, setIconFile] = useState(null);
    const [refFile, setRefFile] = useState(null);

    const [previewIcon, setPreviewIcon] = useState(null);
    const [previewRef, setPreviewRef] = useState(null);

    



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
            [name]: checked
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

        const {
        owner_uid,
        name,
        bio,
        creator,
        iconImg,
        vis,
        exportable,
        link,
        referenceImg,
        tags
        } = formData;

        // Basic validation
        if (!owner_uid){
        errorNotify("Owner id is not valid: " + owner_uid)
        }
        if (
        !name.trim() ||
        !creator.trim()
        
        ) {
        errorNotify("Character Name and Creator Name are required.");
        return;
        }

        // Duplicate check
        await fetchData(user);
        const alreadyExists = characters.some(character => {
            return (
                character.name.toLowerCase() === name.trim().toLowerCase() &&
                character.creator.toLowerCase() === creator.trim().toLowerCase()
            );
        });

        

        if (alreadyExists) {
        errorNotify("This character already exists.");
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
        

        await createCharacter(user, updatedForm)

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


    
    async function fetchData(user, ) {
        try {
            const token = await user.getIdToken();

            const res = await fetch(
            `${import.meta.env.VITE_API_URL}/characters`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        
        if (!res.ok) {
          throw new Error("Failed to fetch characters");
        }

        const data = await res.json();
        console.log("Fetched characters:", data);

        setCharacters(data);
      } catch (err) {
        console.error(err);
      } finally {
        
      }

    }
    


    return (
        <>
        <h1>This is the page to create a new character.</h1>


        <div >

            {/* Job Title */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Character Name</legend>
              <input
                type="text"
                className="input w-full"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Fantasy"
              />
            </fieldset>

            {/* Category */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Character Biography</legend>
              <input
                type="text"
                className="input w-full"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="e.g. John Fantasy once lived..."
              />
            </fieldset>

            {/* Location */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Creator</legend>
              <input
                type="text"
                className="input w-full"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
              />
            </fieldset>


            {/* Tags */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Character Tags (comma separated)
              </legend>
              <input
                type="text"
                className="input w-full"
                onChange={handleTagsChange}
                placeholder=""
              />
            </fieldset>
            
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Character Icon</legend>

                {previewRef && (
                    <img src={previewRef} className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="file-input w-full"
                    onChange={handleIconSelected}
                />
            </fieldset>


            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <label className="label justify-center">
                    Public
                    <input type="checkbox" defaultChecked className="toggle" 
                        name="vis"
                        onChange={handleToggle}
                    />
                    Private
                </label>
            </fieldset>

            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <label className="label justify-center">
                    Can Export
                    <input type="checkbox" defaultChecked className="toggle" 
                        name="exportable"
                        onChange={handleToggle}
                    />
                    Cannot Export
                </label>
            </fieldset>
            
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Reference Picture</legend>

                {previewIcon && (
                    <img src={previewIcon} className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="file-input w-full"
                    onChange={handleRefSelected}
                />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Link</legend>
              <input
                type="text"
                className="input w-full"
                name="link"
                value={formData.link}
                onChange={handleChange}
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
