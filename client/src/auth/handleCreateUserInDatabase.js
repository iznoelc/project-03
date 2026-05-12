export const handleCreateUserInDatabase = async (token, user, formData, signOutUser) => {
    try {
        const postRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                displayName: formData.displayName,
                username: formData.username,
                role: formData.role,
                accountStatus: formData.accountStatus,
            }),
        });

        if (!postRes.ok){
            throw new Error(`[ERROR CREATING USER IN DATABASE] Status: ${postRes.status}`);
        }
        console.log("Post completed successfully")

    } catch (error){
        console.error("[ERROR CREATING USER IN THE DATABASE, DELETING THEM FROM FIREBASE]: ", error);
        
        if (user) {
            try {
                signOutUser(); // first sign the user out so the auth provider doesn't keep trying to fetch data for a uid that doesn't exist
                await user.delete();
            } catch (deleteError) {
                console.error("[ERROR DELETING USER FROM FIREBASE:]", deleteError);   
            }
        }
    }
}