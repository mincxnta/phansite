import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Menu = () => {
    const {user} = useAuth()

    return (
        <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", backgroundColor: "black" }}>
            <button>
                <Link to="/">Home</Link>
            </button>
            <button>
                <Link to="/requests">Requests</Link>
            </button>
            <button>
                <Link to={user ? "/profile" : "/login"}>
                    {user ? "Profile" : "Login"}
                </Link>
            </button>

        </nav>
    )
}