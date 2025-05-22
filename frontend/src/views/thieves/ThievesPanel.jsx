import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext.jsx';
import { RequestList } from "../request/RequestList.jsx"

export const ThiefPanel = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        const verifyThief = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'phantom_thief') {
                navigate('/');
            }
        }
        verifyThief();
    }, [navigate, user])

    return (
        <div>
            <RequestList />
        </div>
    )
}