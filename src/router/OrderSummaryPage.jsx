import React, { useEffect, useState } from 'react';

function TemplateDemo() {
    const [storageData, setStorageData] = useState({});

    useEffect(() => {
        // Function to get all data from local storage
        const getAllStorageData = () => {
            let data = {};
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let value = localStorage.getItem(key);

                // Try to parse the value as JSON; if it fails, keep it as a string
                try {
                    data[key] = JSON.parse(value);  // Attempt to parse JSON
                } catch (e) {
                    data[key] = value;  // If it fails, store as string
                }
            }
            return data;
        };

        // Set storage data state
        setStorageData(getAllStorageData());

        // Log storage data to the console
        console.log('LocalStorage Data:', getAllStorageData());
    }, []);

    return (
        <div>
            <h2>Local Storage Data</h2>
            <pre>{JSON.stringify(storageData, null, 2)}</pre> {/* Pretty print JSON */}
        </div>
    );
}

export default TemplateDemo;

// import React, { useState, useEffect, useRef } from 'react';
// import { OverlayPanel } from 'primereact/overlaypanel';
// import { Button } from 'primereact/button';
// import { Menu } from 'primereact/menu';
// import ContactUs from "../component/ContactUs";
// import { Outlet, Link, useNavigate } from "react-router-dom";
// export default function OrderSummaryPage() {
//     const navigate = useNavigate();
//     const op = useRef(null);
//     const [isContactUsVisible, setContactUsVisible] = useState(false);
//     const itemsMenu = [
//         {
//             label: 'บัญชีของฉัน',
//             command: () => {
//                 navigate("/AccountPage", { state: { activeTab: 'account' } });
//             }
//         },
//         {
//             label: 'ประวัติการสั่งซื้อ',
//             command: () => {
//                 navigate("/AccountPage", { state: { activeTab: 'orderHistory' } });
//             }
//         },
//         {
//             label: 'ติดต่อเรา',
//             command: () => {
//                 setContactUsVisible(true);
//             }
//         },
//         {
//             label: 'ออกจากระบบ',
//             command: () => {
//                 handleLogout();
//             }
//         },
//     ];

//     return (
//         <div className="card flex flex-column align-items-center gap-3">
//             <Button type="button" icon="pi pi-search" label="Search" onClick={(e) => op.current.toggle(e)} />

//             <OverlayPanel ref={op} closeOnEscape>
//                 <div className='w-20rem'>
//                     <div className="flex p-0 pb-2 border-bottom-1 surface-border align-items-center">
//                         <div class="flex flex-wrap justify-content-center">
//                             <div class="border-circle w-4rem h-4rem m-2 bg-primary font-bold flex align-items-center justify-content-center">U</div>
//                         </div>
//                         <h4 className="ml-3">username</h4>
//                     </div>
//                     <div className="flex flex-column">
//                         <Menu model={itemsMenu} className="p-menu" />
//                         <ContactUs visible={isContactUsVisible} setVisible={setContactUsVisible} />
//                     </div>
//                 </div>
//             </OverlayPanel>
//         </div>
//     );
// }
