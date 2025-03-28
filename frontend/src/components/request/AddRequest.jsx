import React, { useState } from 'react'
import { API_URL } from '../../constants/constants'
import { useNavigate, Link } from 'react-router-dom'

export const AddRequest = () => {

    const [title, setTitle] = useState('')
    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const navigate = useNavigate()


    const handleNewRequest = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, target, description })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            await response.json()
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Link to="/requests">Requests</Link>
            <h1>AddRequest</h1>
            <form onSubmit={handleNewRequest}>
                <label>Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter request title" />
                <br />
                <label>Target</label>
                <input type="text" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter target name" />
                <br />
                <label>Description</label>
                <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your password" />
                <br />
                <label>Target image</label>
                <input type="image" value={image} onChange={(e) => setImage(e.target.value)} />
                <input type="submit" value="Send Request" />
            </form>
        </div>
    )
}