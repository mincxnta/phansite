import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            })

            if (response.ok) {
                await response.json()
                navigate('/login')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <br />
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <input type="submit" value="Iniciar sesion" />
            </form>
            <Link to="/login">Login</Link>
        </div>
    )
}