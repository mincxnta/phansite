import React from 'react'

useEffect(() => {
    const getActivePoll = async () => {
        try {
            const response = await fetch(`${API_URL}/polls/active`, {
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
    getActivePoll()
}, [navigate])


export const Poll = () => {
    return (
        <div>
            <h1>
                Question: Do you believe in the Phantom Thieves?
            </h1>
            <div class="w3-border" style={{ border: "3px black solid" }}>
                <div class="w3-red" style={{ height: "28px", width: "20%", backgroundColor: 'red' }}></div>
            </div>
            <button>No</button>
            <button>Yes</button>
        </div>
    )
}