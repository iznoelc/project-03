import { useState, useMemo, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";
import { createCharacter } from "../../utils/CreateDeleteCharacter";

export default function CreateCharacter(){
    const { user } = useAuth();


    return (
        <h1>This is the page to create a new character.</h1>
    )
}