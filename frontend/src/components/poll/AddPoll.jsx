import React, { useState } from 'react'
import { API_URL } from '../../constants/constants'
import { useNavigate, Link } from 'react-router-dom'

export const AddPoll = () => {

    const [question, setQuestion] = useState('')
    const navigate = useNavigate()


    const handleNewPoll = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/polls`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
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
            <h1>New poll</h1>
            <form onSubmit={handleNewPoll}>
                <label>Question</label>
                <input type="text" required placeholder="Enter poll question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <br />
                <input type="submit" value="Publish poll" />
            </form>
        </div>
    )
}