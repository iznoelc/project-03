import { useState, useMemo, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";
import { createCharacter } from "../../utils/CreateDeleteCharacter";

export default function CreateCharacter(){
    const { user } = useAuth();

    const [characters, setCharacters] = useState([]); // Data for the characters being fetched

    



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
        


        await createCharacter(user, formData)

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
