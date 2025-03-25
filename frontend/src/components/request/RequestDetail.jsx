import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import '../../assets/requests/RequestDetail.css'

export const RequestDetail = () => {
    const [request, setRequest] = useState(null)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const url = `${API_URL}/requests/${id}`;

                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                })

                if (!response.ok) {
                    console.log('Error')
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                setRequest(data)
            } catch (error) {
                console.log(error)
                navigate('/')

            }
        }
        fetchRequest()
    }, [navigate])

    if (!request) {
        return <div>Carregant...</div>;
    }

    return (
        <>

            <div>
                <h2>{request.status}</h2>
                <h1>{request.title}</h1>
            </div>

            <table>
                <tbody>
                    <tr>
                        <td>
                            <h3>Target</h3>
                        </td>
                        <td>
                            <h3>Image</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>{request.target}</h3>
                        </td>
                        <td rowSpan='3'>
                            <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ width: '200px' }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Description</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>{request.description}</h3>
                        </td>
                    </tr>
                </tbody>
            </table >

        </>
    )
}