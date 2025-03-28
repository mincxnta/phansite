import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'

export const UserList = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
                    try {
                        const response = await fetch(`${API_URL}/users`, {
                            method: 'GET',
                            credentials: 'include'
                        })
        
                        console.log(response)
                        if (response.ok) {
                            const data = await response.json()
                            setUsers(data)
                        }
                    } catch (error) {
                        console.log(error.message)
                        navigate('/')
        
                    }
                }
                fetchUsers()
    }, [navigate])

    const handleBan = async (userId) => {

            try {
                const response = await fetch(`${API_URL}/users/${userId}/ban`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({banned: true})
                })
    
                if (response.ok) {
                    await response.json()
                } else {
                    console.log('Error')
                }
            } catch (error) {
                console.log(error)
            }
        }

    return (
        <div>
            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <button><Link to={`/profile/${user.username}`}>{user.username}</Link></button>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleBan(user.id)}>Ban</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}