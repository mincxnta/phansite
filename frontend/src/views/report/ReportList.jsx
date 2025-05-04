import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReportedComments } from './ReportedComments.jsx'
import { ReportedRequests } from './ReportedRequests.jsx'

export const ReportList = () => {
    const { t } = useTranslation();
    
    return (
        <div>
            <h1>{t("reports.title")}</h1>
            <ReportedComments />
            <ReportedRequests />
        </div>
    )
}