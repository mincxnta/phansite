import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from './Menu'
export const Home = () => {
    return (
        <div>
            <Menu/>
            <h1>Home yuju</h1>
            <Link to="/newrequest">Create Request</Link>

        </div>
    )
}