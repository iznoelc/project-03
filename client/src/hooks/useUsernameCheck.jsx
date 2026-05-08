import { useState, useEffect } from "react";

export default function useUsernameCheck(username) {
    const [usernameAvail, setUsernameAvail] = useState(null);
    const [usernameChecking, setUsernameChecking] = useState(false);

    useEffect(() => {
        if (!username || username.length < 3) return;

        const timeout = setTimeout(async () => {
            setUsernameChecking(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/check-username?username=${username}`);
                const data = await res.json();
                setUsernameAvail(data.available);
            } catch (err) {
                console.error("Username check failed:", err);
            }
            setUsernameChecking(false);
        }, 500);

        return () => {
            clearTimeout(timeout);
            setUsernameAvail(null);
        };
    }, [username]);

    return { usernameAvail, usernameChecking };
}