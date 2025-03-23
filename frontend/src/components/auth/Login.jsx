import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'

export const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            await response.json()
            navigate('/')
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <label>Username</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

                <input type="submit" value="Iniciar sesion" />
                <Link to="/register">Register</Link>

            </form>
        </div>
    )
}