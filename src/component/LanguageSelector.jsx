import { changeLanguage } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from "primereact/button";

const languages = [
    { code: "th", lang: "TH" },
    { code: "la", lang: "LA" },
]

function LanguageSelector() {
    const { i18n } = useTranslation()

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div className='mb-1'>
            {languages.map((lng) => {
                return (
                    <Button key={lng.code} className={lng.code === i18n.language ? "py-1 px-2 text-primary bg-primary-50" : "py-1 px-2 text-500"} label={lng.lang} size="small" text onClick={() => changeLanguage(lng.code)} />
                )
            })}
        </div>
    )
}

export default LanguageSelector