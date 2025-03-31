import { useEffect } from "react"
import { UserList } from "./UserList.jsx"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext.jsx';

export const Admin = () => {
    const navigate = useNavigate()
    const {user} = useAuth()

    useEffect(() => {
        const verifyAdmin = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'admin') {
                navigate('/');
            }
        }
        verifyAdmin();
    }, [navigate, user])


    return (
        <div>
            <h1>Panel de administración</h1>
            <h4>Usuarios</h4>
            <h5>Lista de usuarios</h5>
            <UserList />
            <h5>Crear usuario</h5>
            <button> <Link to="create">Crear usuario</Link></button>
        </div>
    )
}