import React, { useState } from 'react'


export const Perfil = () => {
    const [username, setUsername] = useState(null)
    //const [password, setPassword] = useState(null)
    return (
        <div>
            <h1>Perfil</h1>
            <p>Hola soy ${username}</p>
        </div>
    )
}