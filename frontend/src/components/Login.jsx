import React, { useState } from 'react'

export const Login = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)


    return (
        <div>
            <h1>Login</h1>
            <form>
                <label>Username</label>
                <input type="text" value={username} placeholder="Enter your username" />
                <br />
                <label>Password</label>
                <input type="password" value={password} placeholder="Enter your password" />

                <input type="submit" value="Iniciar sesion" />
            </form>
        </div>
    )
}