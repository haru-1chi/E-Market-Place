import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import line_contact from '../../assets/line_contact.jpg';

function HelpCenterPage() {
    const [activeTab, setActiveTab] = useState('SellerCenter');
    const location = useLocation();

    const tabs = [
        { id: 'SellerCenter', label: 'Seller Center' },
        { id: 'contactChannel', label: 'ช่องทางการติดต่อ' },
        { id: 'contactUs', label: 'ติดตามเรา' }
    ];

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const SellerCenter = () => (
        <>
            <div className='w-full pt-5 flex justify-content-center'>
                <div className='w-fit bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
                    <h2 className="m-0 p-0 font-semibold text-center">วิธีการสมัคร Partner</h2>

                </div>

            </div>
        </>
    );

    const ContactChannel = () => (
        <>
            <div className='w-full pt-5 flex justify-content-center'>
                <div className='w-fit bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
                    <h2 className="m-0 p-0 font-semibold text-center">ช่องทางการติดต่อ</h2>
                    <div className="justify-content-center my-3">
                        <p>บริษัททศกัณฐ์ ดิจิตอล นิว เจนเนอเรชั่น จำกัด(สำนักงานใหญ่)</p>
                        <p>103 หมู่ 4 ถนนรอบเมืองเชียงใหม่ ตำบลสุเทพ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50200</p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="grid">
                            <div className="col-4">
                                <div className="flex align-items-center">
                                    <i className="pi pi-phone"></i><p className="ml-2 m-0">เบอร์โทรศัพท์:</p>
                                </div>

                            </div>
                            <div className="col-8 align-self-center" >
                                <p className="m-0">052083288</p>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-4">
                                <div className="flex align-items-center">
                                    <i className="pi pi-facebook"></i><p className="text-center mx-2">Facebook:</p>
                                </div>
                            </div>
                            <div className="col-8 align-self-center" >
                                <a href="https://www.facebook.com/people/Tossagun-One-Stop-Shop/61555941742281/" target="_blank">Tossagun One Stop Shop </a>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-4">
                                <div className="flex align-items-center">
                                    <i className="pi pi-globe"></i><p className="ml-2 m-0">Website:</p>
                                </div>
                            </div>
                            <div className="col-8 align-self-center" >
                                <a href="https://tossaguns.com" target="_blank">https://tossaguns.com</a>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-4 align-self-center">
                                <div className="flex align-items-center">
                                    <i className="pi pi-envelope"></i><p className="ml-2 m-0">E-mail:</p>
                                </div>
                            </div>
                            <div className="col-8 align-self-center" >
                                <p className="white-space-normal">tossagundigitalnewgeneration@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="block sm:hidden">
                        <div className="mb-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-phone"></i><p className="ml-2 m-0">เบอร์โทรศัพท์</p>
                            </div>
                            <div className="align-self-center" >
                                <p className="my-2 ml-4">052083288</p>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-facebook"></i><p className="ml-2 m-0">Facebook</p>
                            </div>
                            <div className="align-self-center" >
                                <a className="my-2 ml-4" href="https://www.facebook.com/people/Tossagun-One-Stop-Shop/61555941742281/" target="_blank">Tossagun One Stop Shop </a>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="">
                                <div className="flex align-items-center">
                                    <i className="pi pi-globe"></i><p className="ml-2 m-0">Website</p>
                                </div>
                            </div>
                            <div className=" align-self-center" >
                                <a className="my-2 ml-4" href="https://tossaguns.com" target="_blank">https://tossaguns.com</a>
                            </div>
                        </div>
                        <div>
                            <div className=" align-self-center">
                                <div className="flex align-items-center">
                                    <i className="pi pi-envelope"></i><p className="ml-2 m-0">E-mail</p>
                                </div>
                            </div>
                            <div className="align-self-center" >
                                <p className="white-space-normal my-2 ml-4">tossagundigitalnewgeneration@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );

    const ContactUs = () => (
        <>
            <div className='w-full pt-5 flex justify-content-center'>
                <div className='w-fit bg-section-product flex flex-column border-1 surface-border border-round p-3 bg-white border-round-mb justify-content-center'>
                    <h2 className="m-0 p-0 font-semibold text-center">ติดตามเรา</h2>
                    <div className="flex justify-content-center">
                        <img
                            src={line_contact}
                            alt=""
                            className="w-12rem"
                        />
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-mobile"></i><p className="text-center">Line: @tossagun</p>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        Tel. 052083288
                    </div>

                        <div className="my-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-facebook"></i><p className="ml-2 m-0">Facebook</p>
                            </div>
                            <div className="align-self-center" >
                                <a className="my-2 ml-4" href="https://www.facebook.com/people/Tossagun-One-Stop-Shop/61555941742281/" target="_blank">Tossagun One Stop Shop </a>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="">
                                <div className="flex align-items-center">
                                    <i className="pi pi-globe"></i><p className="ml-2 m-0">Website</p>
                                </div>
                            </div>
                            <div className=" align-self-center" >
                                <a className="my-2 ml-4" href="https://tossaguns.com" target="_blank">https://tossaguns.com</a>
                            </div>
                        </div>
                        <div>
                            <div className=" align-self-center">
                                <div className="flex align-items-center">
                                    <i className="pi pi-envelope"></i><p className="ml-2 m-0">E-mail</p>
                                </div>
                            </div>
                            <div className="align-self-center" >
                                <p className="white-space-normal my-2 ml-4">tossagundigitalnewgeneration@gmail.com</p>
                            </div>
                        </div>
                    </div>

            </div>
        </>
    );

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'SellerCenter':
                return <SellerCenter />;
            case 'contactChannel':
                return <ContactChannel />;
            case 'contactUs':
                return <ContactUs />;
            default:
                return <SellerCenter />;
        }
    };

    return (
        <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8 mb-5">
            {renderActiveComponent()}
        </div>
    )
}

export default HelpCenterPage