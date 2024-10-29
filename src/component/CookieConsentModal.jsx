import React, { useEffect, useState } from 'react';

export default function CookieConsentModal() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowModal(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <>
            <div className="flex justify-content-center  align-items-center fixed z-5 bottom-0 left-0 right-0 m-3">
                <div className="w-fit bg-white border-round-lg p-3 shadow-5">
                    <div className='flex justify-content-between align-items-center'>
                        <p className='font-bold text-900 m-0'>เว็บไซต์นี้ใช้คุกกี้</p>
                        <p className='font-bold text-900 m-0 cursor-pointer' onClick={handleClose}><i className="pi pi-times"></i></p>
                    </div>
                    <p className='text-900 m-0 mt-2'>เว็บไซต์ของเราใช้คุกกี้ในการให้บริการและปรับปรุงเนื้อหา เพื่อเข้าใจความต้องการและมอบประสบการณ์ที่ดีสำหรับคุณ</p>
                </div>
            </div>
            
        </>
    );
}