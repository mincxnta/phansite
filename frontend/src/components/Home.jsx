import React from 'react'
import { Poll } from './poll/Poll'
import { useTranslation } from 'react-i18next'
export const Home = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t("home")}</h1>
            <Poll />
        </div>
    )
}