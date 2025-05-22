import React from 'react'
import { ReportedComments } from './ReportedComments.jsx'
import { ReportedRequests } from './ReportedRequests.jsx'

export const ReportList = () => {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ReportedComments />
            <ReportedRequests />
        </div>
    )
}