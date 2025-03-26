import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from './Menu'
export const Poll = () => {
    return (
        <div>
            <h1>
                Question: Do you believe in the Phantom Thieves?
            </h1>
            <div class="w3-border">
                <div class="w3-red" style="height:28px;width:20%"></div>
            </div>
            <button>No</button>
            <button>Yes</button>
        </div>
    )
}