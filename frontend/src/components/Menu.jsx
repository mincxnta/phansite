import { useState, useEffect } from "react";
import { getAuthUser } from "../utils/auth";
import { Link } from 'react-router-dom'

export const Menu = () => {
    const [authUser, setAuthUser] = useState(null);

    // useEffect(() => {
    //     const isUserLogged = async () => {
    //         const authData = await getAuthUser()
    //         if (authData) {
    //             setAuthUser(authData)
    //         }

    //     }
    //     isUserLogged()
    // }, [])

    return (
        <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between" }}>
            <button>
                <Link to="/">Home</Link>
            </button>
            <button>
                {/* <Link to={authUser ? "/profile" : "/login"}>
                    {authUser ? "Profile" : "Login"}
                </Link> */}
            </button>

        </nav>
    )
}