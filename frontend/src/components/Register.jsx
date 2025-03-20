import React, { useState } from 'react'

export const Register = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)


    return (
        <div>
            <h1>Login</h1>
            <form>
                <label>Username</label>
                <input type="text" value={username} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} placeholder="Enter your password" />
                <br />
                <label>Email</label>
                <input type="email" value={email} placeholder="phantom@aficionado.xyz" />
                <input type="submit" value="Iniciar sesion" />
            </form>
        </div>
    )
}