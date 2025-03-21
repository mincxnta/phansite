import React, { useState } from 'react'

export const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')


    return (
        <div>
            <h1>Register</h1>
            <form>
                <label>Username</label>
                <input type="text" value={username}  onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <br />
                <label>Email</label>
                <input type="email" value={email}  onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <input type="submit" value="Iniciar sesion" />
            </form>
        </div>
    )
}