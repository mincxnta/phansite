import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { showRequestDetail } from './RequestDetail.jsx'

export const RequestList = () => {
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
            <h1>New Request</h1>
            <Link to="/newrequest">Create Request</Link>
            <h1>Requests</h1>
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
                                {request.status}
                            </td>
                            <td>
                                {/* <button><Link to={`${request.id}`}>{request.title}</Link></button> */}
                                <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
                            </td>
                            <td>
                                {request.target}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}