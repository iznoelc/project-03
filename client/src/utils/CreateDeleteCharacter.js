import { errorNotify, successNotify } from "../utils/ToastifyNotifications";

/**
 * CreateDeleteCharacter
 * 
 * Functions used within the site to create and delete characters from the database
 * 
 * @author Landon Chapin
 */


export async function deleteCharacter(character_id, user) {

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/characters/${character_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        successNotify("Character deleted");
    } else {
        errorNotify("uh oh, failed to delete character");
    }
}



export async function createCharacter(user, formData) {
    const {
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

    try {
        const token = await user.getIdToken();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/characters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                owner_uid: user.uid,
                name,
                bio,
                creator,
                iconImg,
                vis,
                exportable,
                link,
                referenceImg,
                tags
            }),
        });

        const text = await response.text();
        console.log("Response:", text);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        successNotify("Character created successfully!");

    } catch (error) {
        console.error("Error creating character:", error);
        errorNotify("Failed to create character");
    }
}
