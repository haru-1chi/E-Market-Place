import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
function HelpCenterPage() {
    const [activeTab, setActiveTab] = useState('privacyPolicyMembers');
    const [htmlContent, setHtmlContent] = useState('');
    const location = useLocation();
    
    const tabs = [
        { id: 'privacyPolicyMembers', label: 'นโยบายความเป็นส่วนตัวสำหรับสมาชิก' },
        { id: 'privacyPolicyCustomers', label: 'นโยบายความเป็นส่วนตัวสำหรับลูกค้า' },
        { id: 'cookiePolicy', label: 'นโยบายเกี่ยวกับการใช้งาน Cookies' },
        { id: 'companyPolicy', label: 'นโยบายบริษัท' },
        // { id: 'pdpaLegalTeam', label: 'ทีมกฎหมาย PDPA Form' },
        { id: 'legalRightsPrivacy', label: 'ข้อกฎหมายและสิทธิส่วนบุคคล' },
    ];

    const loadHtmlContent = async (tabId) => {
        try {
            const response = await fetch(`/privacy/${tabId}.html`);
            const text = await response.text();
            setHtmlContent(text);
        } catch (error) {
            console.error("Error loading HTML content:", error);
        }
    };

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    useEffect(() => {
        loadHtmlContent(activeTab);
    }, [activeTab]);
    return (
        <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8 mb-5">
            <h1 className='flex justify-content-center font-semibold m-0 p-0 py-3'>นโยบายของ E-Market</h1>
            <div className='w-full gap-4 lg:flex justify-content-between'>
                <div className='mt-2 lg:mt-0 w-full lg:w-3 h-fit flex flex-column border-1 surface-border border-round p-3 bg-white border-round-mb mb-2'>
                    <ul className='m-0 p-0 font-semibold'>
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`list-none cursor-pointer py-3 border-bottom-1 surface-border ${activeTab === tab.id ? 'text-yellow-500' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                }}
                            >
                                {tab.label}

                            </li>
                        ))}
                    </ul>
                </div>

                <div className='w-full lg:w-full flex flex-column gap-2 p-4 bg-white border-1 surface-border border-round'>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
            </div >
        </div>
    )
}

export default HelpCenterPage