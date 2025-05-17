import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReportedComments } from './ReportedComments.jsx'
import { ReportedRequests } from './ReportedRequests.jsx'

export const ReportList = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ReportedComments />
            <ReportedRequests />
        </div>
    )
}