import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'

export const CreateUser = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const navigate = useNavigate()

    const handleCreateUser = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/admin/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, role })
            })

            if (response.ok) {
                await response.json()
                navigate('/admin')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>Create user</h1>
            <form onSubmit={handleCreateUser}>
                <label>Username</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <br />
                <label>Email</label>
                <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <label>Role</label>
                <select value={role} required onChange={(e) => setRole(e.target.value)}>
                    <option value="fan">Fan</option>
                    <option value="phantom_thief">Phantom thief</option>
                    <option value="admin">Admin</option>
                </select>                
                <input type="submit" value="Crear usuario" />
            </form>
            <Link to="/login">Login</Link>
        </div>
    )
}