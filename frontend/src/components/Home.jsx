import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div>
            <h1>Home yuju</h1>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/newrequest">Create Request</Link>

        </div>
    )
}