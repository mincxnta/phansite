import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'

export const UserList = () => {
    const [requests, setRequests] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/requests`, {
                    method: 'GET',
                    credentials: 'include'
                })

                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setRequests(data)
                }
            } catch (error) {
                console.log(error.message)
                navigate('/')

            }
        }
        fetchRequests()
    }, [navigate])

    return (
        <div>
            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Title</th>
                        <th>Target</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>
                                <button><Link to={``}>{request.title}</Link></button>
                            </td>
                            <td>{request.email}</td>
                            <td>
                                <button onClick={() => handleBan(request.id)}>Ban</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}