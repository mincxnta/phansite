import { Link } from 'react-router-dom'

export const Menu = ({ authUser }) => {

    return (
        <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", backgroundColor: "black" }}>
            <button>
                <Link to="/">Home</Link>
            </button>
            <button>
                <Link to={authUser ? "/profile" : "/login"}>
                    {authUser ? "Profile" : "Login"}
                </Link>
            </button>

        </nav>
    )
}